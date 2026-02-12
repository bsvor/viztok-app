import { SupabaseClient } from "@supabase/supabase-js";
import { FREE_WEEKLY_VIEW_LIMIT } from "./stripe-config";

interface SubscriptionProfile {
  subscription_status: string;
  subscription_tier: string;
  subscription_period_end: string | null;
  stripe_customer_id: string | null;
}

export async function getSubscription(
  supabase: SupabaseClient,
  userId: string
): Promise<SubscriptionProfile | null> {
  const { data } = await supabase
    .from("profiles")
    .select("subscription_status, subscription_tier, subscription_period_end, stripe_customer_id")
    .eq("id", userId)
    .single();
  return data;
}

export function isSubscribed(profile: SubscriptionProfile | null): boolean {
  if (!profile) return false;
  return profile.subscription_status === "active" || profile.subscription_status === "trialing";
}

export async function checkViewLimit(
  supabase: SupabaseClient,
  userId: string
): Promise<{ allowed: boolean; viewsUsed: number; limit: number }> {
  // Get start of current week (Monday)
  const now = new Date();
  const day = now.getDay();
  const diff = day === 0 ? 6 : day - 1; // Monday = 0
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - diff);
  weekStart.setHours(0, 0, 0, 0);

  const { count } = await supabase
    .from("video_views")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId)
    .gte("viewed_at", weekStart.toISOString());

  const viewsUsed = count ?? 0;

  return {
    allowed: viewsUsed < FREE_WEEKLY_VIEW_LIMIT,
    viewsUsed,
    limit: FREE_WEEKLY_VIEW_LIMIT,
  };
}

export async function recordView(
  supabase: SupabaseClient,
  userId: string,
  videoId: string
): Promise<void> {
  await supabase
    .from("video_views")
    .upsert(
      { user_id: userId, video_id: videoId, viewed_at: new Date().toISOString() },
      { onConflict: "user_id,video_id" }
    );
}

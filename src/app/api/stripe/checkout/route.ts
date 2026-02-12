import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getStripe, TIERS } from "@/lib/stripe";

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { tier } = await request.json();
  const tierConfig = TIERS[tier as keyof typeof TIERS];

  if (!tierConfig) {
    return NextResponse.json({ error: "Invalid tier" }, { status: 400 });
  }

  // Look up or create Stripe customer
  const { data: profile } = await supabase
    .from("profiles")
    .select("stripe_customer_id")
    .eq("id", user.id)
    .single();

  let customerId = profile?.stripe_customer_id;

  if (!customerId) {
    const customer = await getStripe().customers.create({
      email: user.email,
      metadata: { supabase_user_id: user.id },
    });
    customerId = customer.id;

    await supabase
      .from("profiles")
      .update({ stripe_customer_id: customerId })
      .eq("id", user.id);
  }

  const origin = request.headers.get("origin") || "http://localhost:3001";

  const session = await getStripe().checkout.sessions.create({
    customer: customerId,
    mode: "subscription",
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: `Viztok ${tierConfig.name}`,
            description: tierConfig.description,
          },
          unit_amount: tierConfig.price,
          recurring: { interval: tierConfig.interval },
        },
        quantity: 1,
      },
    ],
    metadata: { tier, supabase_user_id: user.id },
    success_url: `${origin}/settings?subscription=success`,
    cancel_url: `${origin}/settings?subscription=cancelled`,
  });

  return NextResponse.json({ url: session.url });
}

"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/browser";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { TIERS } from "@/lib/stripe-config";

interface SubscriptionInfo {
  subscription_status: string;
  subscription_tier: string;
  subscription_period_end: string | null;
}

export default function SettingsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [subscription, setSubscription] = useState<SubscriptionInfo | null>(null);
  const [subLoading, setSubLoading] = useState<string | null>(null);

  const subscriptionResult = searchParams.get("subscription");

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user?.email) setEmail(user.email);
      if (user) {
        supabase
          .from("profiles")
          .select("subscription_status, subscription_tier, subscription_period_end")
          .eq("id", user.id)
          .single()
          .then(({ data }) => {
            if (data) setSubscription(data);
          });
      }
    });
  }, []);

  const isActive = subscription?.subscription_status === "active" || subscription?.subscription_status === "trialing";

  async function handleUpgrade(tier: string) {
    setSubLoading(tier);
    const res = await fetch("/api/stripe/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tier }),
    });
    const data = await res.json();
    if (data.url) {
      window.location.href = data.url;
    }
    setSubLoading(null);
  }

  async function handleManageSubscription() {
    setSubLoading("portal");
    const res = await fetch("/api/stripe/portal", {
      method: "POST",
    });
    const data = await res.json();
    if (data.url) {
      window.location.href = data.url;
    }
    setSubLoading(null);
  }

  async function handlePasswordUpdate(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      setError(error.message);
    } else {
      setSuccess("Password updated successfully");
      setNewPassword("");
      setConfirmPassword("");
    }
    setLoading(false);
  }

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <h1 className="text-3xl font-heading font-bold mb-2">Settings</h1>
        <p className="text-light/50">Manage your account</p>
      </div>

      {subscriptionResult === "success" && (
        <div className="mb-6 px-4 py-2.5 rounded-lg bg-green-500/10 border border-green-500/20 text-sm text-green-400">
          Subscription activated! You now have unlimited access.
        </div>
      )}

      <div className="space-y-6">
        <Card>
          <h2 className="text-lg font-heading font-bold mb-4">Account</h2>
          <div className="space-y-3">
            <div>
              <label className="text-sm text-light/50">Email</label>
              <p className="text-light">{email}</p>
            </div>
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-heading font-bold mb-4">Subscription</h2>
          {isActive ? (
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="px-2.5 py-1 rounded bg-cyan/10 text-cyan text-sm font-semibold uppercase">
                  {subscription?.subscription_tier}
                </span>
                <span className="text-light/50 text-sm">Active</span>
              </div>
              {subscription?.subscription_period_end && (
                <p className="text-light/50 text-sm mb-4">
                  Renews on{" "}
                  {new Date(subscription.subscription_period_end).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              )}
              <Button
                variant="secondary"
                onClick={handleManageSubscription}
                loading={subLoading === "portal"}
              >
                Manage Subscription
              </Button>
            </div>
          ) : (
            <div>
              <div className="flex items-center gap-3 mb-3">
                <span className="px-2.5 py-1 rounded bg-white/5 text-light/50 text-sm font-semibold uppercase">
                  Free
                </span>
                <span className="text-light/50 text-sm">1 video per week</span>
              </div>
              <p className="text-light/50 text-sm mb-4">
                Upgrade to unlock unlimited viewing.
              </p>
              <div className="flex gap-4">
                {(Object.entries(TIERS) as [string, typeof TIERS[keyof typeof TIERS]][]).map(
                  ([key, tier]) => (
                    <div
                      key={key}
                      className={`flex-1 rounded-lg border p-4 ${
                        key === "standard"
                          ? "border-cyan/30 bg-cyan/5"
                          : "border-teal/30 bg-teal/5"
                      }`}
                    >
                      <h3 className="font-heading font-bold text-light mb-1">
                        {tier.name}
                      </h3>
                      <p className="text-light/50 text-sm mb-3">
                        {tier.description}
                      </p>
                      <button
                        onClick={() => handleUpgrade(key)}
                        disabled={subLoading !== null}
                        className={`w-full px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                          key === "standard"
                            ? "bg-cyan text-navy hover:bg-cyan/90"
                            : "bg-teal text-white hover:bg-teal/90"
                        } disabled:opacity-50`}
                      >
                        {subLoading === key
                          ? "Loading..."
                          : `$${(tier.price / 100).toFixed(2)}/mo`}
                      </button>
                    </div>
                  )
                )}
              </div>
            </div>
          )}
        </Card>

        <Card>
          <h2 className="text-lg font-heading font-bold mb-4">
            Change Password
          </h2>
          <form onSubmit={handlePasswordUpdate} className="space-y-4">
            <Input
              label="New Password"
              type="password"
              placeholder="At least 6 characters"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            <Input
              label="Confirm New Password"
              type="password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            {error && (
              <p className="text-red-400 text-sm">{error}</p>
            )}
            {success && (
              <p className="text-green-400 text-sm">{success}</p>
            )}
            <Button type="submit" loading={loading}>
              Update Password
            </Button>
          </form>
        </Card>

        <Card>
          <h2 className="text-lg font-heading font-bold mb-4">Sign Out</h2>
          <p className="text-light/50 text-sm mb-4">
            Sign out of your Viztok account on this device.
          </p>
          <Button variant="secondary" onClick={handleSignOut}>
            Sign Out
          </Button>
        </Card>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { TIERS } from "@/lib/stripe-config";

interface UpgradePromptProps {
  viewsUsed: number;
  limit: number;
}

export function UpgradePrompt({ viewsUsed, limit }: UpgradePromptProps) {
  const [loading, setLoading] = useState<string | null>(null);

  async function handleUpgrade(tier: string) {
    setLoading(tier);
    const res = await fetch("/api/stripe/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tier }),
    });
    const data = await res.json();
    if (data.url) {
      window.location.href = data.url;
    }
    setLoading(null);
  }

  return (
    <div className="relative w-full aspect-video bg-gradient-to-br from-teal/10 to-navy border border-white/10 rounded-xl overflow-hidden flex items-center justify-center">
      <div className="text-center px-8 max-w-lg">
        <div className="w-16 h-16 rounded-full bg-cyan/20 flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-cyan" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
          </svg>
        </div>
        <h2 className="text-xl font-heading font-bold mb-2">
          Weekly Limit Reached
        </h2>
        <p className="text-light/50 text-sm mb-6">
          You&apos;ve watched {viewsUsed}/{limit} free video{limit === 1 ? "" : "s"} this week.
          Upgrade to unlock unlimited viewing.
        </p>
        <div className="flex gap-3 justify-center">
          {(Object.entries(TIERS) as [string, typeof TIERS[keyof typeof TIERS]][]).map(
            ([key, tier]) => (
              <button
                key={key}
                onClick={() => handleUpgrade(key)}
                disabled={loading !== null}
                className={`px-6 py-3 rounded-lg text-sm font-semibold transition-colors ${
                  key === "standard"
                    ? "bg-cyan text-navy hover:bg-cyan/90"
                    : "bg-teal text-white hover:bg-teal/90"
                } disabled:opacity-50`}
              >
                {loading === key ? "Loading..." : `${tier.name} — $${(tier.price / 100).toFixed(2)}/mo`}
              </button>
            )
          )}
        </div>
      </div>
    </div>
  );
}

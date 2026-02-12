"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/browser";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

// Toggle to false to re-enable login
const COMING_SOON = true;

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    router.push("/feed");
    router.refresh();
  }

  if (COMING_SOON) {
    return (
      <Card className="text-center">
        <div className="w-16 h-16 rounded-full bg-cyan/10 flex items-center justify-center mx-auto mb-6">
          <svg
            className="w-8 h-8 text-cyan"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
            />
          </svg>
        </div>
        <h1 className="text-2xl font-heading font-bold mb-3">Coming Soon</h1>
        <p className="text-light/50 text-sm mb-6 max-w-xs mx-auto">
          Viztok is launching soon. Sign up for the waitlist to be the first to know when we go live.
        </p>
        <a
          href="https://viztok.com"
          className="text-cyan text-sm hover:underline"
        >
          Back to viztok.com
        </a>
      </Card>
    );
  }

  return (
    <Card>
      <h1 className="text-2xl font-heading font-bold mb-6 text-center">
        Sign In
      </h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Email"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Input
          label="Password"
          type="password"
          placeholder="Your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error && (
          <p className="text-red-400 text-sm text-center">{error}</p>
        )}
        <Button type="submit" loading={loading} className="w-full">
          Sign In
        </Button>
      </form>
      <div className="mt-6 text-center text-sm text-light/50 space-y-2">
        <p>
          <Link
            href="/forgot-password"
            className="text-cyan hover:underline"
          >
            Forgot your password?
          </Link>
        </p>
        <p>
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-cyan hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </Card>
  );
}

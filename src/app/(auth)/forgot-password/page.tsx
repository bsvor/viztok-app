"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/browser";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const supabase = createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/api/auth/callback`,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    setSent(true);
    setLoading(false);
  }

  if (sent) {
    return (
      <Card className="text-center">
        <div className="w-12 h-12 rounded-full bg-cyan/20 flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-6 h-6 text-cyan"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
        </div>
        <h2 className="text-xl font-heading font-bold mb-2">Email Sent</h2>
        <p className="text-light/50 text-sm mb-6">
          If an account exists for <strong className="text-light">{email}</strong>,
          you&apos;ll receive a password reset link shortly.
        </p>
        <Link href="/login" className="text-cyan text-sm hover:underline">
          Back to sign in
        </Link>
      </Card>
    );
  }

  return (
    <Card>
      <h1 className="text-2xl font-heading font-bold mb-2 text-center">
        Reset Password
      </h1>
      <p className="text-light/50 text-sm text-center mb-6">
        Enter your email and we&apos;ll send you a reset link.
      </p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Email"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        {error && (
          <p className="text-red-400 text-sm text-center">{error}</p>
        )}
        <Button type="submit" loading={loading} className="w-full">
          Send Reset Link
        </Button>
      </form>
      <div className="mt-6 text-center text-sm text-light/50">
        <p>
          <Link href="/login" className="text-cyan hover:underline">
            Back to sign in
          </Link>
        </p>
      </div>
    </Card>
  );
}

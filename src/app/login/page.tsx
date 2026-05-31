"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { getApiErrorMessage } from "@/lib/api";
import { LoadingState } from "@/components/Loader";

export default function LoginPage() {
  const router = useRouter();
  const { login, signup, loading, isAuthenticated } = useAuth();

  useEffect(() => {
    if (loading || !isAuthenticated) return;
    router.replace("/home");
  }, [loading, isAuthenticated, router]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignup, setIsSignup] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      if (isSignup) {
        await signup(email, password);
      } else {
        await login(email, password);
      }
    } catch (err: unknown) {
      setError(getApiErrorMessage(err, { context: "auth" }));
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <LoadingState
        fullScreen
        title="Loading account"
      />
    );
  }

  if (isAuthenticated) {
    return (
      <LoadingState
        fullScreen
        title="Opening workspace"
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-sm border border-[var(--glass-border)] rounded-xl bg-[var(--card)] backdrop-blur-xl p-8 shadow-[0_4px_24px_rgba(0,0,0,0.06)]">
        <h1 className="text-2xl font-bold mb-1">Subscription Guardian</h1>
        <p className="text-[var(--muted)] text-sm mb-6">
          {isSignup ? "Create an account" : "Sign in to your account"}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
            />
          </div>
          {error && (
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          )}
          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-lg bg-[var(--accent)] py-2.5 text-white font-medium hover:opacity-90 disabled:opacity-50 transition"
          >
            {submitting ? "…" : isSignup ? "Sign up" : "Log in"}
          </button>
        </form>

        <button
          type="button"
          onClick={() => { setIsSignup((v) => !v); setError(""); }}
          className="mt-4 w-full text-sm text-[var(--muted)] hover:text-[var(--foreground)]"
        >
          {isSignup ? "Already have an account? Log in" : "Need an account? Sign up"}
        </button>
      </div>

      <Link href="/" className="mt-6 text-sm text-[var(--muted)] hover:underline">
        ← Back to home
      </Link>
    </div>
  );
}

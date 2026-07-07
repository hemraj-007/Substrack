"use client";

import Link from "next/link";
import { PageShell } from "@/components/ui/PageShell";
import { EmptyState } from "@/components/ui/EmptyState";

export default function InsightsPage() {
  return (
    <PageShell
      title="AI Insights"
      description="Personalized recommendations powered by your spending patterns."
    >
      <EmptyState
        title="AI insights coming soon"
        description="We're building smart recommendations to help you find unused subscriptions, compare plans, and save money. Your redesigned dashboard is ready — AI will plug in here next."
        action={
          <Link
            href="/dashboard"
            className="glow-button inline-block rounded-xl px-4 py-2 text-sm font-semibold"
          >
            Back to dashboard
          </Link>
        }
      />
    </PageShell>
  );
}

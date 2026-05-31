"use client";

import { useMemo, useState } from "react";
import { useFetch } from "@/hooks/useFetch";
import { subscriptionsApi, transactionsApi } from "@/lib/api";
import Link from "next/link";
import { GlassCard, CardHeader } from "@/components/GlassCard";
import { LoadingState } from "@/components/Loader";
import { PageHeaderCard } from "@/components/PageHeaderCard";

const FILTERS = [
  { value: "all", label: "All" },
  { value: "ACTIVE", label: "Active" },
  { value: "AT_RISK", label: "At risk" },
] as const;

function useDashboardStats() {
  const subs = useFetch(
    () => subscriptionsApi.list().then((r) => r.data),
    { deps: [] }
  );
  const tx = useFetch(
    () => transactionsApi.list().then((r) => r.data),
    { deps: [] }
  );

  const subscriptions = subs.data ?? [];
  const active = subscriptions.filter(
    (s) => (s.status ?? "").toUpperCase() === "ACTIVE"
  ).length;
  const atRiskList = subscriptions.filter(
    (s) => (s.status ?? "").toUpperCase() === "AT_RISK"
  );
  const atRisk = atRiskList.length;
  const monthlySpend =
    subscriptions.reduce((sum, s) => sum + (Number(s.amount) || 0), 0) || 0;
  const potentialSavings =
    atRiskList.reduce((sum, s) => sum + (Number(s.amount) || 0), 0) || 0;

  return {
    subscriptions,
    transactions: tx.data ?? [],
    monthlySpend,
    activeSubscriptions: active,
    atRiskSubscriptions: atRisk,
    potentialSavings,
    loading: subs.isLoading || tx.isLoading,
    error: subs.error || tx.error,
  };
}

export default function DashboardPage() {
  const {
    monthlySpend,
    activeSubscriptions,
    atRiskSubscriptions,
    potentialSavings,
    subscriptions,
    transactions,
    loading,
    error,
  } = useDashboardStats();
  const [filter, setFilter] = useState<"all" | "ACTIVE" | "AT_RISK">("all");
  const [hoveredMonth, setHoveredMonth] = useState<string | null>(null);

  const trend = useMemo(() => {
    const now = new Date();
    const months: { key: string; label: string; amount: number }[] = [];
    for (let i = 5; i >= 0; i -= 1) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      months.push({
        key,
        label: d.toLocaleString("default", { month: "short" }),
        amount: 0,
      });
    }
    for (const tx of transactions) {
      const date = new Date(String(tx.date ?? ""));
      if (Number.isNaN(date.getTime())) continue;
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      const row = months.find((m) => m.key === key);
      if (row) row.amount += Number(tx.amount) || 0;
    }
    return months;
  }, [transactions]);

  const categoryBreakdown = useMemo(() => {
    const buckets = {
      Streaming: 0,
      Productivity: 0,
      Shopping: 0,
      Utilities: 0,
      Other: 0,
    };
    for (const sub of subscriptions) {
      const merchant = String(sub.merchant ?? "").toLowerCase();
      const amount = Number(sub.amount) || 0;
      if (/netflix|spotify|prime|disney|hulu|youtube/.test(merchant)) {
        buckets.Streaming += amount;
      } else if (/notion|adobe|figma|canva|github|slack|zoom|chatgpt/.test(merchant)) {
        buckets.Productivity += amount;
      } else if (/amazon|flipkart|instacart|walmart|shopping/.test(merchant)) {
        buckets.Shopping += amount;
      } else if (/icloud|google one|dropbox|vpn|internet|cloud/.test(merchant)) {
        buckets.Utilities += amount;
      } else {
        buckets.Other += amount;
      }
    }

    return Object.entries(buckets)
      .map(([name, amount]) => ({ name, amount }))
      .filter((d) => d.amount > 0)
      .sort((a, b) => b.amount - a.amount);
  }, [subscriptions]);

  const maxTrendAmount = Math.max(...trend.map((d) => d.amount), 1);
  const maxCategory = Math.max(...categoryBreakdown.map((d) => d.amount), 1);
  const avgMonthly =
    trend.reduce((sum, point) => sum + point.amount, 0) / Math.max(trend.length, 1);

  if (loading) {
    return (
      <LoadingState
        title="Loading dashboard"
      />
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 dark:bg-red-950/30 p-4 text-red-700 dark:text-red-300 glass-card">
        Failed to load dashboard. Please try again.
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      <PageHeaderCard
        variant="stacked"
        title="Financial Command Center"
        description="Monitor recurring spend, identify risky renewals, and surface savings opportunities in one place."
        showIdentifier={false}
        showDividers={false}
      >
        {FILTERS.map(({ value, label }) => (
          <button
            key={value}
            type="button"
            onClick={() => setFilter(value)}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
              filter === value ? "pill-active" : "pill-inactive"
            }`}
          >
            {label}
          </button>
        ))}
      </PageHeaderCard>

      <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
        <GlassCard className="metric-card p-4 sm:p-6">
          <p className="text-sm text-[var(--muted)]">Monthly Subscription Spend</p>
          <p className="mt-1 sm:mt-2 text-2xl sm:text-3xl font-extrabold text-[var(--foreground)]">
            ${monthlySpend.toFixed(2)}
          </p>
          <p className="text-xs text-[var(--muted)] mt-1 sm:mt-2">Based on detected subscriptions</p>
        </GlassCard>
        <GlassCard className="metric-card p-4 sm:p-6">
          <p className="text-sm text-[var(--muted)]">Active Subscriptions</p>
          <p className="mt-1 sm:mt-2 text-2xl sm:text-3xl font-extrabold text-[var(--foreground)]">
            {activeSubscriptions}
          </p>
          <Link
            href="/dashboard/subscriptions"
            className="mt-1 sm:mt-2 inline-block text-xs text-[var(--accent-hover)] hover:text-[var(--foreground)]"
          >
            View subscriptions
          </Link>
        </GlassCard>
        <GlassCard className="metric-card p-4 sm:p-6">
          <p className="text-sm text-[var(--muted)]">At-Risk Subscriptions</p>
          <p className="mt-1 sm:mt-2 text-2xl sm:text-3xl font-extrabold text-[var(--foreground)]">
            {atRiskSubscriptions}
          </p>
          {atRiskSubscriptions > 0 && (
            <Link
              href="/dashboard/subscriptions?filter=AT_RISK"
              className="inline-block mt-1 sm:mt-2 text-xs text-amber-300 hover:text-amber-100"
            >
              Review →
            </Link>
          )}
        </GlassCard>
        <GlassCard className="metric-card p-4 sm:p-6">
          <p className="text-sm text-[var(--muted)]">Potential Savings</p>
          <p className="mt-1 sm:mt-2 text-2xl sm:text-3xl font-extrabold text-[var(--foreground)]">
            ${potentialSavings.toFixed(2)}
          </p>
          <p className="text-xs text-[var(--muted)] mt-1 sm:mt-2">
            Estimated from at-risk recurring charges
          </p>
        </GlassCard>
      </div>

      <div className="grid gap-4 grid-cols-1 xl:grid-cols-3">
        <GlassCard className="p-4 sm:p-6 xl:col-span-2">
          <CardHeader title="Subscription Spend Trend" viewAllHref="/dashboard/transactions" />
          <div className="space-y-3 sm:space-y-4">
            <div className="animate-chart rounded-xl sm:rounded-2xl border border-[var(--border)] bg-[var(--card)] backdrop-blur-sm p-3 sm:p-4 overflow-x-auto">
              <svg viewBox="0 0 640 220" className="w-full min-w-[280px] h-[180px] sm:h-[220px]">
                <defs>
                  <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="var(--accent)" />
                    <stop offset="100%" stopColor="var(--accent-2)" />
                  </linearGradient>
                </defs>
                {trend.map((point, index) => {
                  const x = 24 + index * 118;
                  const y = 180 - (point.amount / maxTrendAmount) * 130;
                  return (
                    <g key={point.key}>
                      <circle
                        cx={x}
                        cy={y}
                        r="6"
                        fill="url(#lineGradient)"
                        className="cursor-pointer"
                        onMouseEnter={() => setHoveredMonth(point.key)}
                        onMouseLeave={() => setHoveredMonth(null)}
                      />
                      <text x={x} y={206} textAnchor="middle" fill="var(--muted)" fontSize="12">
                        {point.label}
                      </text>
                    </g>
                  );
                })}
                <polyline
                  fill="none"
                  stroke="url(#lineGradient)"
                  strokeWidth="4"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  points={trend
                    .map((point, index) => {
                      const x = 24 + index * 118;
                      const y = 180 - (point.amount / maxTrendAmount) * 130;
                      return `${x},${y}`;
                    })
                    .join(" ")}
                />
              </svg>
            </div>
            <div className="text-xs text-[var(--muted)]">
              {hoveredMonth
                ? (() => {
                    const point = trend.find((t) => t.key === hoveredMonth);
                    return point
                      ? `${point.label}: $${point.amount.toFixed(2)} total spend`
                      : "Hover over a point to inspect month-by-month spend.";
                  })()
                : "Hover over a point to inspect month-by-month spend."}
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-4 sm:p-6">
          <CardHeader title="Contextual Insights" viewAllHref="/dashboard/alerts" />
          <div className="space-y-3 sm:space-y-4 text-sm">
            <div className="rounded-xl border border-[var(--border)] bg-[var(--glass)] backdrop-blur-sm p-3">
              <p className="text-[var(--muted)]">Average monthly spend</p>
              <p className="mt-1 text-xl font-bold text-[var(--foreground)]">
                ${avgMonthly.toFixed(2)}
              </p>
            </div>
            <div className="rounded-xl border border-[var(--border)] bg-[var(--glass)] backdrop-blur-sm p-3">
              <p className="text-[var(--muted)]">High-priority renewals</p>
              <p className="mt-1 text-xl font-bold text-[var(--foreground)]">
                {atRiskSubscriptions}
              </p>
            </div>
            <div className="rounded-xl border border-[var(--border)] bg-[var(--glass)] backdrop-blur-sm p-3">
              <p className="text-[var(--muted)]">Recommended actions</p>
              <div className="mt-2 flex flex-wrap gap-2">
                <Link
                  href="/dashboard/subscriptions?filter=AT_RISK"
                  className="rounded-lg border border-[var(--border)] px-3 py-1.5 text-xs hover:bg-[var(--glass-hover)]"
                >
                  Review at-risk
                </Link>
                <Link
                  href="/dashboard/upload"
                  className="rounded-lg border border-[var(--border)] px-3 py-1.5 text-xs hover:bg-[var(--glass-hover)]"
                >
                  Upload latest CSV
                </Link>
              </div>
            </div>
          </div>
        </GlassCard>
      </div>

      <GlassCard className="p-4 sm:p-6">
        <CardHeader title="Subscription Categories" viewAllHref="/dashboard/subscriptions" />
        {categoryBreakdown.length === 0 ? (
          <p className="text-sm text-[var(--muted)]">
            No category data yet. Detect subscriptions to see allocation.
          </p>
        ) : (
          <div className="space-y-3">
            {categoryBreakdown.map((item) => (
              <div key={item.name} className="space-y-1.5">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[var(--foreground)]">{item.name}</span>
                  <span className="font-semibold text-[var(--foreground)]">
                    ${item.amount.toFixed(2)}
                  </span>
                </div>
                <div className="h-2 rounded-full bg-[var(--glass)] border border-[var(--border)] overflow-hidden">
                  <div
                    className="h-full animate-chart bg-gradient-to-r from-[var(--accent)] to-[var(--chart-purple)]"
                    style={{ width: `${(item.amount / maxCategory) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </GlassCard>
    </div>
  );
}

"use client";

import { useMemo, useState } from "react";
import { useFetch } from "@/hooks/useFetch";
import { subscriptionsApi, transactionsApi } from "@/lib/api";
import Link from "next/link";
import { GlassCard, CardHeader } from "@/components/GlassCard";
import { LoadingState } from "@/components/Loader";
import { PageHeaderCard } from "@/components/PageHeaderCard";
import { RenewalCalendar } from "@/components/RenewalCalendar";
import { formatInr } from "@/lib/currency";
import { useCardFilterParams, useCardFilterQueryKey } from "@/hooks/useCardFilter";

const FILTERS = [
  { value: "all", label: "All" },
  { value: "ACTIVE", label: "Active" },
  { value: "AT_RISK", label: "At risk" },
] as const;

function useDashboardStats() {
  const cardKey = useCardFilterQueryKey();
  const cardParams = useCardFilterParams();

  const summary = useFetch(
    () => subscriptionsApi.summary(cardParams).then((r) => r.data),
    { deps: [cardKey] }
  );
  const subs = useFetch(
    () => subscriptionsApi.list(cardParams).then((r) => r.data),
    { deps: [cardKey] }
  );
  const tx = useFetch(
    () => transactionsApi.list().then((r) => r.data),
    { deps: [] }
  );

  const selectedIds =
    cardParams?.cardIds?.split(",").filter(Boolean) ?? null;

  const subscriptions = subs.data ?? [];
  const transactions = (tx.data ?? []).filter((row) => {
    if (!selectedIds?.length) return true;
    return selectedIds.includes(String(row.cardId ?? ""));
  });

  const atRiskList = subscriptions.filter(
    (s) => (s.status ?? "").toUpperCase() === "AT_RISK"
  );
  const atRisk = atRiskList.length;
  const potentialSavings =
    atRiskList.reduce((sum, s) => sum + (Number(s.amount) || 0), 0) || 0;

  const monthlySpend = summary.data?.monthlyTotal ?? 0;
  const activeSubscriptions = summary.data?.activeCount ?? 0;

  return {
    summary: summary.data,
    subscriptions,
    transactions,
    monthlySpend,
    activeSubscriptions,
    atRiskSubscriptions: atRisk,
    potentialSavings,
    loading: summary.isLoading || subs.isLoading || tx.isLoading,
    error: summary.error || subs.error || tx.error,
  };
}

export default function DashboardPage() {
  const {
    summary,
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
      if ((sub.status ?? "").toUpperCase() !== "ACTIVE") continue;
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

      {summary && (
        <GlassCard className="p-4 sm:p-6 border-[var(--accent)]/20 bg-gradient-to-br from-[var(--glass)] to-[var(--card)]">
          <p className="text-lg sm:text-xl font-bold text-[var(--foreground)] leading-snug">
            {summary.headline}
          </p>
          {summary.upcoming.next7Days.length > 0 && (
            <p className="text-sm text-[var(--muted)] mt-2">
              {summary.upcoming.next7Days.length} renewal
              {summary.upcoming.next7Days.length === 1 ? "" : "s"} in the next 7 days
            </p>
          )}
        </GlassCard>
      )}

      <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
        <GlassCard className="metric-card p-4 sm:p-6">
          <p className="text-sm text-[var(--muted)]">Monthly Subscription Spend</p>
          <p className="mt-1 sm:mt-2 text-2xl sm:text-3xl font-extrabold text-[var(--foreground)]">
            {formatInr(monthlySpend)}
          </p>
          <p className="text-xs text-[var(--muted)] mt-1 sm:mt-2">Active subscriptions only</p>
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
            {formatInr(potentialSavings)}
          </p>
          <p className="text-xs text-[var(--muted)] mt-1 sm:mt-2">
            Estimated from at-risk recurring charges
          </p>
        </GlassCard>
      </div>

      {summary && (
        <GlassCard className="p-4 sm:p-6">
          <CardHeader
            title="Renewal calendar"
            viewAllHref="/dashboard/subscriptions"
          />
          <p className="text-sm text-[var(--muted)] mb-4 -mt-2">
            Upcoming charges based on detected billing cycles
          </p>
          <RenewalCalendar
            next7Days={summary.upcoming.next7Days}
            next30Days={summary.upcoming.next30Days}
          />
        </GlassCard>
      )}

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
                      ? `${point.label}: ${formatInr(point.amount)} total card spend`
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
              <p className="text-[var(--muted)]">Average monthly card spend</p>
              <p className="mt-1 text-xl font-bold text-[var(--foreground)]">
                {formatInr(avgMonthly)}
              </p>
            </div>
            <div className="rounded-xl border border-[var(--border)] bg-[var(--glass)] backdrop-blur-sm p-3">
              <p className="text-[var(--muted)]">Renewals in next 7 days</p>
              <p className="mt-1 text-xl font-bold text-[var(--foreground)]">
                {summary?.upcoming.next7Days.length ?? 0}
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
                    {formatInr(item.amount)}
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

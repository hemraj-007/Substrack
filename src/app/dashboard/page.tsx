"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useFetch } from "@/hooks/useFetch";
import { useAuth } from "@/hooks/useAuth";
import { subscriptionsApi, transactionsApi } from "@/lib/api";
import { LoadingState } from "@/components/Loader";
import { CardFilter } from "@/components/CardFilter";
import { formatInr } from "@/lib/currency";
import { categorizeMerchant } from "@/lib/categories";
import { useCardFilterParams, useCardFilterQueryKey } from "@/hooks/useCardFilter";
import { CategoryDonutChart } from "@/components/ui/CategoryDonutChart";
import { DashboardHeader, type DateRange } from "@/components/dashboard/DashboardHeader";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { DashboardSpendChart } from "@/components/dashboard/DashboardSpendChart";
import { DashboardBarChart } from "@/components/dashboard/DashboardBarChart";
import { RenewalsTimeline } from "@/components/dashboard/RenewalsTimeline";
import { TransactionsPanel } from "@/components/dashboard/TransactionsPanel";
import { SubscriptionsGrid } from "@/components/dashboard/SubscriptionsGrid";
import { AiInsightsPanel } from "@/components/dashboard/AiInsightsPanel";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { DashCard } from "@/components/dashboard/DashCard";

const DONUT_COLORS: Record<string, string> = {
  Entertainment: "#8B5CF6",
  Shopping: "#F59E0B",
  "AI Tools": "#5B5CEB",
  Utilities: "#22C55E",
  Other: "#94A3B8",
};

function displayCategory(merchant: string): string {
  const cat = categorizeMerchant(merchant);
  if (cat === "Streaming") return "Entertainment";
  if (cat === "Productivity") return "AI Tools";
  if (cat === "Food") return "Other";
  return cat;
}

function inDateRange(dateStr: string, range: DateRange): boolean {
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return false;
  const now = new Date();
  if (range === "today") {
    return date.toDateString() === now.toDateString();
  }
  if (range === "month") {
    return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
  }
  const cutoff = new Date(now);
  cutoff.setDate(cutoff.getDate() - 30);
  return date >= cutoff;
}

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

export default function DashboardPage() {
  const { user } = useAuth();
  const displayName = user?.email?.split("@")[0] ?? "there";
  const [range, setRange] = useState<DateRange>("30d");
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
  const tx = useFetch(() => transactionsApi.list().then((r) => r.data), { deps: [] });

  const selectedIds = cardParams?.cardIds?.split(",").filter(Boolean) ?? null;
  const subscriptions = subs.data ?? [];
  const allTransactions = (tx.data ?? []).filter((row) => {
    if (!selectedIds?.length) return true;
    return selectedIds.includes(String(row.cardId ?? ""));
  });

  const transactions = useMemo(
    () => allTransactions.filter((t) => inDateRange(String(t.date ?? ""), range)),
    [allTransactions, range]
  );

  const atRiskList = subscriptions.filter((s) => (s.status ?? "").toUpperCase() === "AT_RISK");
  const potentialSavings = atRiskList.reduce((sum, s) => sum + (Number(s.amount) || 0), 0);
  const monthlySpend = summary.data?.monthlyTotal ?? 0;
  const activeSubscriptions = summary.data?.activeCount ?? 0;
  const renewalsThisMonth = summary.data?.upcoming.next30Days.length ?? 0;

  const trend = useMemo(() => {
    const now = new Date();
    const months: { label: string; value: number }[] = [];
    for (let i = 5; i >= 0; i -= 1) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months.push({ label: d.toLocaleString("default", { month: "short" }), value: 0 });
    }
    const keys = months.map((_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    });
    for (const t of allTransactions) {
      if (t.type === "CREDIT") continue;
      const date = new Date(String(t.date ?? ""));
      if (Number.isNaN(date.getTime())) continue;
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      const idx = keys.indexOf(key);
      if (idx >= 0) months[idx]!.value += Number(t.amount) || 0;
    }
    return months;
  }, [allTransactions]);

  const spendDelta = useMemo(() => {
    if (trend.length < 2) return null;
    const prev = trend[trend.length - 2]!.value;
    const curr = trend[trend.length - 1]!.value;
    if (prev === 0) return null;
    const pct = Math.round(((curr - prev) / prev) * 100);
    return pct;
  }, [trend]);

  const categoryData = useMemo(() => {
    const buckets: Record<string, number> = {};
    for (const sub of subscriptions) {
      if ((sub.status ?? "").toUpperCase() !== "ACTIVE") continue;
      const cat = displayCategory(String(sub.merchant ?? ""));
      buckets[cat] = (buckets[cat] ?? 0) + (Number(sub.amount) || 0);
    }
    return Object.entries(buckets).map(([name, value]) => ({
      name,
      value,
      color: DONUT_COLORS[name] ?? "#94A3B8",
    }));
  }, [subscriptions]);

  const barData = useMemo(() => trend.slice(-6), [trend]);

  const loading = summary.isLoading || subs.isLoading || tx.isLoading;
  const error = summary.error || subs.error || tx.error;

  if (loading) return <LoadingState title="Loading dashboard" />;
  if (error) {
    return (
      <DashCard className="p-6 text-red-500 text-sm" hover={false}>
        Failed to load dashboard. Please try again.
      </DashCard>
    );
  }

  const upcoming = summary.data?.upcoming.next30Days.slice(0, 4) ?? [];

  if (subscriptions.length === 0) {
    return (
      <motion.div initial="hidden" animate="show" variants={stagger} className="space-y-6">
        <motion.div variants={fadeUp}>
          <DashboardHeader name={displayName} range={range} onRangeChange={setRange} />
        </motion.div>
        <motion.div variants={fadeUp}>
          <CardFilter />
        </motion.div>
        <motion.div variants={fadeUp}>
          <DashCard className="p-12 sm:p-16 text-center" hover={false}>
            <div className="w-16 h-16 rounded-2xl bg-violet-50 text-[#5B5CEB] flex items-center justify-center text-3xl mx-auto mb-6">
              📊
            </div>
            <h2 className="text-2xl font-bold text-slate-900">No subscriptions detected yet</h2>
            <p className="text-sm text-slate-500 mt-2 max-w-md mx-auto">
              Upload a bank statement to automatically find recurring charges and build your dashboard.
            </p>
            <Link href="/dashboard/upload" className="dash-btn-primary inline-flex mt-8 px-6 py-3 text-sm font-semibold">
              Upload Statement
            </Link>
          </DashCard>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div initial="hidden" animate="show" variants={stagger} className="space-y-6">
      <motion.div variants={fadeUp}>
        <DashboardHeader name={displayName} range={range} onRangeChange={setRange} />
      </motion.div>

      <motion.div variants={fadeUp}>
        <CardFilter />
      </motion.div>

      <motion.div variants={fadeUp} className="grid gap-6 grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          label="Monthly Spend"
          value={formatInr(monthlySpend)}
          comparison={spendDelta != null ? `${spendDelta >= 0 ? "↑" : "↓"}${Math.abs(spendDelta)}% vs last month` : undefined}
          icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
        <KpiCard
          label="Subscriptions"
          value={activeSubscriptions}
          comparison="Active recurring"
          icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          }
        />
        <KpiCard
          label="Upcoming Renewals"
          value={renewalsThisMonth}
          comparison="Next 30 days"
          icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          }
        />
        <KpiCard
          label="Potential Savings"
          value={formatInr(potentialSavings)}
          comparison="From at-risk subs"
          icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
            </svg>
          }
        />
      </motion.div>

      <motion.div variants={fadeUp} className="grid gap-6 grid-cols-1 xl:grid-cols-3">
        <DashCard className="p-6 xl:col-span-2">
          <h2 className="text-base font-semibold text-slate-900 mb-4">Spending Overview</h2>
          <DashboardSpendChart data={trend} />
        </DashCard>
        <DashCard className="p-6">
          <h2 className="text-base font-semibold text-slate-900 mb-4">Categories</h2>
          <CategoryDonutChart data={categoryData} />
        </DashCard>
      </motion.div>

      <motion.div variants={fadeUp} className="grid gap-6 grid-cols-1 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <RenewalsTimeline items={upcoming} />
          <DashCard className="p-6">
            <h2 className="text-base font-semibold text-slate-900 mb-4">Spend Trend</h2>
            <DashboardBarChart data={barData} />
          </DashCard>
        </div>
        <AiInsightsPanel savingsAmount={potentialSavings} />
      </motion.div>

      <motion.div variants={fadeUp}>
        <TransactionsPanel transactions={transactions} />
      </motion.div>

      <motion.div variants={fadeUp}>
        <SubscriptionsGrid subscriptions={subscriptions} />
      </motion.div>

      <motion.div variants={fadeUp}>
        <QuickActions />
      </motion.div>
    </motion.div>
  );
}

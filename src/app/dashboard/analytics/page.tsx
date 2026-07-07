"use client";

import { useMemo } from "react";
import { useFetch } from "@/hooks/useFetch";
import { transactionsApi, subscriptionsApi } from "@/lib/api";
import { LoadingState } from "@/components/Loader";
import { PageShell } from "@/components/ui/PageShell";
import { MetricCard } from "@/components/ui/MetricCard";
import { SpendLineChart } from "@/components/ui/SpendLineChart";
import { CategoryDonutChart } from "@/components/ui/CategoryDonutChart";
import { formatInr } from "@/lib/currency";
import { categorizeMerchant, CATEGORY_COLORS } from "@/lib/categories";
import { useCardFilterParams, useCardFilterQueryKey } from "@/hooks/useCardFilter";

export default function AnalyticsPage() {
  const cardKey = useCardFilterQueryKey();
  const cardParams = useCardFilterParams();
  const selectedIds = cardParams?.cardIds?.split(",").filter(Boolean) ?? null;

  const { data: transactions = [], isLoading } = useFetch(
    () => transactionsApi.list().then((r) => r.data),
    { deps: [] }
  );
  const { data: summary } = useFetch(
    () => subscriptionsApi.summary(cardParams).then((r) => r.data),
    { deps: [cardKey] }
  );

  const filteredTx = useMemo(() => {
    return (transactions ?? []).filter((t) => {
      if (t.type === "CREDIT") return false;
      if (!selectedIds?.length) return true;
      return selectedIds.includes(String(t.cardId ?? ""));
    });
  }, [transactions, selectedIds]);

  const trend = useMemo(() => {
    const now = new Date();
    const months: { label: string; value: number }[] = [];
    const keys: string[] = [];
    for (let i = 5; i >= 0; i -= 1) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      keys.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`);
      months.push({ label: d.toLocaleString("default", { month: "short" }), value: 0 });
    }
    for (const tx of filteredTx) {
      const date = new Date(String(tx.date));
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      const idx = keys.indexOf(key);
      if (idx >= 0) months[idx]!.value += Number(tx.amount) || 0;
    }
    return months;
  }, [filteredTx]);

  const categoryData = useMemo(() => {
    const buckets: Record<string, number> = {};
    for (const tx of filteredTx) {
      const cat = categorizeMerchant(String(tx.merchant ?? ""));
      buckets[cat] = (buckets[cat] ?? 0) + (Number(tx.amount) || 0);
    }
    return Object.entries(buckets).map(([name, value]) => ({
      name,
      value,
      color: CATEGORY_COLORS[name as keyof typeof CATEGORY_COLORS] ?? "#94a3b8",
    }));
  }, [filteredTx]);

  const totalSpend = filteredTx.reduce((s, t) => s + (Number(t.amount) || 0), 0);
  const avgMonthly = trend.reduce((s, m) => s + m.value, 0) / Math.max(trend.length, 1);
  const thisMonth = trend[trend.length - 1]?.value ?? 0;
  const lastMonth = trend[trend.length - 2]?.value ?? 0;
  const momDelta =
    lastMonth > 0 ? `${(((thisMonth - lastMonth) / lastMonth) * 100).toFixed(0)}% vs last month` : undefined;

  if (isLoading) return <LoadingState title="Loading analytics" />;

  return (
    <PageShell title="Analytics" description="Spending trends and category breakdown.">
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
        <MetricCard label="Total card spend" value={formatInr(totalSpend)} subtext="All uploaded debits" />
        <MetricCard
          label="Avg monthly spend"
          value={formatInr(avgMonthly)}
          subtext="Last 6 months"
          trend={momDelta ? { value: momDelta, positive: thisMonth <= lastMonth } : undefined}
        />
        <MetricCard
          label="Subscription spend"
          value={formatInr(summary?.monthlyTotal ?? 0)}
          subtext="Active subscriptions"
        />
      </div>
      <div className="grid gap-4 grid-cols-1 xl:grid-cols-2">
        <div className="content-card p-6">
          <h2 className="font-semibold mb-4">Monthly spend trend</h2>
          <SpendLineChart data={trend} />
        </div>
        <div className="content-card p-6">
          <h2 className="font-semibold mb-4">Spend by category</h2>
          <CategoryDonutChart data={categoryData} />
        </div>
      </div>
    </PageShell>
  );
}

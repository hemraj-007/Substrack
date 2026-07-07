"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useFetch } from "@/hooks/useFetch";
import { subscriptionsApi, transactionsApi } from "@/lib/api";
import { LoadingState } from "@/components/Loader";
import { formatInr } from "@/lib/currency";
import { getMerchantBrand } from "@/lib/merchantLogos";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { SpendLineChart } from "@/components/ui/SpendLineChart";
import { DataTable } from "@/components/ui/DataTable";
import { formatCardShort } from "@/lib/cards";

function confidenceScore(merchant: string, txCount: number): number {
  const known = /netflix|spotify|amazon|apple|google|adobe|notion/i.test(merchant);
  if (txCount >= 3) return known ? 98 : 90;
  if (txCount >= 2) return known ? 85 : 75;
  return known ? 70 : 55;
}

export default function SubscriptionDetailPage() {
  const params = useParams();
  const id = String(params.id ?? "");

  const { data: sub, isLoading, error } = useFetch(
    () => subscriptionsApi.get(id).then((r) => r.data),
    { deps: [id], enabled: !!id }
  );
  const { data: transactions = [] } = useFetch(
    () => transactionsApi.list().then((r) => r.data),
    { deps: [] }
  );

  const txList = transactions ?? [];

  const relatedTx = useMemo(() => {
    if (!sub) return [];
    const merchantKey = (sub.merchant ?? "").toLowerCase();
    return txList
      .filter(
        (t) =>
          t.cardId === sub.cardId &&
          String(t.merchant ?? "").toLowerCase().includes(merchantKey.split(" ")[0] ?? "")
      )
      .sort((a, b) => new Date(String(b.date)).getTime() - new Date(String(a.date)).getTime());
  }, [sub, txList]);

  const spendTrend = useMemo(() => {
    const byMonth = new Map<string, number>();
    for (const t of relatedTx) {
      if (t.type === "CREDIT") continue;
      const d = new Date(String(t.date));
      const key = d.toLocaleString("default", { month: "short" });
      byMonth.set(key, (byMonth.get(key) ?? 0) + Number(t.amount));
    }
    return Array.from(byMonth.entries())
      .slice(0, 6)
      .map(([label, value]) => ({ label, value }));
  }, [relatedTx]);

  if (isLoading) return <LoadingState title="Loading subscription" />;
  if (error || !sub) {
    return (
      <div className="content-card p-6 space-y-3">
        <p className="text-red-600 text-sm">Subscription not found.</p>
        <Link href="/dashboard/subscriptions" className="text-sm text-[var(--accent)]">
          ← Back to subscriptions
        </Link>
      </div>
    );
  }

  const brand = getMerchantBrand(sub.merchant);
  const status = (sub.status ?? "ACTIVE").toUpperCase();
  const statusVariant =
    status === "AT_RISK" ? "at_risk" : status === "CANCELED" ? "canceled" : "active";
  const score = confidenceScore(sub.merchant, relatedTx.length);

  return (
    <div className="space-y-6">
      <Link href="/dashboard/subscriptions" className="text-sm text-[var(--accent)] hover:underline">
        ← Subscriptions
      </Link>

      <div className="content-card p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <span
              className="w-14 h-14 rounded-xl flex items-center justify-center text-lg font-bold"
              style={{ backgroundColor: brand.bg, color: brand.color }}
            >
              {brand.initial}
            </span>
            <div>
              <h1 className="text-2xl font-bold text-[var(--foreground)]">{sub.merchant}</h1>
              <p className="text-sm text-[var(--muted)] capitalize">
                {(sub.frequency ?? "monthly").toLowerCase()} plan
              </p>
            </div>
          </div>
          <StatusBadge variant={statusVariant} />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-[var(--border)]">
          <div>
            <p className="text-xs text-[var(--muted)]">Price</p>
            <p className="font-semibold text-[var(--foreground)]">{formatInr(sub.amount)}/mo</p>
          </div>
          <div>
            <p className="text-xs text-[var(--muted)]">Next payment</p>
            <p className="font-semibold text-[var(--foreground)]">
              {sub.nextCharge
                ? new Date(sub.nextCharge).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })
                : "—"}
            </p>
          </div>
          <div>
            <p className="text-xs text-[var(--muted)]">Card</p>
            <p className="font-semibold text-[var(--foreground)]">
              {sub.card ? formatCardShort(sub.card) : "—"}
            </p>
          </div>
          <div>
            <p className="text-xs text-[var(--muted)]">Confidence</p>
            <p className="font-semibold text-[var(--foreground)]">{score}%</p>
          </div>
        </div>
      </div>

      {spendTrend.length > 0 && (
        <div className="content-card p-6">
          <h2 className="font-semibold text-[var(--foreground)] mb-4">Spend trend</h2>
          <SpendLineChart data={spendTrend} />
        </div>
      )}

      <div>
        <h2 className="font-semibold text-[var(--foreground)] mb-3">Payment history</h2>
        <DataTable
          columns={[
            {
              key: "date",
              header: "Date",
              cell: (t) =>
                new Date(String(t.date)).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                }),
            },
            {
              key: "amount",
              header: "Amount",
              cell: (t) => formatInr(Number(t.amount)),
            },
            {
              key: "type",
              header: "Type",
              cell: (t) => (t.type === "CREDIT" ? "Credit" : "Debit"),
            },
          ]}
          data={relatedTx}
          keyFn={(t) => t.id}
          emptyMessage="No matching transactions found."
        />
      </div>
    </div>
  );
}

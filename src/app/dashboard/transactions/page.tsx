"use client";

import { useCallback, useMemo, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useFetch } from "@/hooks/useFetch";
import { transactionsApi, subscriptionsApi, type Transaction } from "@/lib/api";
import { LoadingState } from "@/components/Loader";
import { PageShell } from "@/components/ui/PageShell";
import { DataTable } from "@/components/ui/DataTable";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Pagination } from "@/components/Pagination";
import { formatInr } from "@/lib/currency";
import { categorizeMerchant } from "@/lib/categories";
import { getMerchantBrand } from "@/lib/merchantLogos";
import { cardsApi } from "@/lib/api";

const PAGE_SIZE = 10;

export default function TransactionsPage() {
  const searchParams = useSearchParams();
  const q = (searchParams.get("q") ?? "").trim().toLowerCase();
  const [page, setPage] = useState(1);

  const fetcher = useCallback(() => transactionsApi.list().then((r) => r.data), []);
  const { data: transactions = [], isLoading } = useFetch(fetcher, { deps: [] });
  const { data: subscriptions = [] } = useFetch(
    () => subscriptionsApi.list().then((r) => r.data),
    { deps: [] }
  );
  const { data: cards = [] } = useFetch(() => cardsApi.list().then((r) => r.data), { deps: [] });

  const cardMap = useMemo(() => {
    const m = new Map<string, string>();
    for (const c of cards ?? []) m.set(c.id, c.last4);
    return m;
  }, [cards]);

  const recurringKeys = useMemo(() => {
    const set = new Set<string>();
    for (const s of subscriptions ?? []) {
      set.add(`${s.cardId}:${(s.merchant ?? "").toLowerCase()}`);
    }
    return set;
  }, [subscriptions]);

  const filtered = useMemo(() => {
    let list = [...(transactions ?? [])];
    if (q) {
      list = list.filter((t) => {
        const merchant = (t.merchant ?? "").toLowerCase();
        return merchant.includes(q) || String(t.amount).includes(q);
      });
    }
    return list.sort(
      (a, b) => new Date(String(b.date)).getTime() - new Date(String(a.date)).getTime()
    );
  }, [transactions, q]);

  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  useEffect(() => setPage(1), [q]);

  return (
    <PageShell
      title="Transactions"
      description="All transactions from your uploaded statements."
    >
      {isLoading ? (
        <LoadingState title="Loading transactions" />
      ) : (
        <>
          <DataTable
            columns={[
              {
                key: "merchant",
                header: "Merchant",
                cell: (t: Transaction) => {
                  const brand = getMerchantBrand(String(t.merchant ?? ""));
                  return (
                    <div className="flex items-center gap-2">
                      <span
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold shrink-0"
                        style={{ backgroundColor: brand.bg, color: brand.color }}
                      >
                        {brand.initial}
                      </span>
                      <span className="font-medium">{t.merchant ?? "—"}</span>
                    </div>
                  );
                },
              },
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
                key: "category",
                header: "Category",
                cell: (t) => categorizeMerchant(String(t.merchant ?? "")),
              },
              {
                key: "card",
                header: "Card",
                cell: (t) => `•••• ${cardMap.get(t.cardId) ?? "—"}`,
              },
              {
                key: "type",
                header: "Type",
                cell: (t) => {
                  const key = `${t.cardId}:${String(t.merchant ?? "").toLowerCase()}`;
                  const recurring = recurringKeys.has(key);
                  return recurring ? "Recurring" : "One-time";
                },
              },
              {
                key: "status",
                header: "Status",
                cell: (t) => (
                  <StatusBadge
                    variant={Number(t.amount) > 1000 ? "high" : "normal"}
                    label={Number(t.amount) > 1000 ? "High" : "Normal"}
                  />
                ),
              },
            ]}
            data={paginated}
            keyFn={(t) => t.id}
            emptyMessage="No transactions yet. Upload a statement from Statements."
          />
          <Pagination
            totalItems={filtered.length}
            pageSize={PAGE_SIZE}
            currentPage={page}
            onPageChange={setPage}
          />
        </>
      )}
    </PageShell>
  );
}

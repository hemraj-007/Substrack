"use client";

import { useCallback, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useFetch } from "@/hooks/useFetch";
import { transactionsApi, type Transaction } from "@/lib/api";
import { GlassCard } from "@/components/GlassCard";
import { LoadingState } from "@/components/Loader";
import { Pagination } from "@/components/Pagination";
import { PageHeaderCard } from "@/components/PageHeaderCard";

const PAGE_SIZE = 5;

export default function TransactionsPage() {
  const searchParams = useSearchParams();
  const q = (searchParams.get("q") ?? "").trim().toLowerCase();
  const [page, setPage] = useState(1);

  const fetcher = useCallback(
    () => transactionsApi.list().then((r) => r.data),
    []
  );
  const { data: transactions = [], isLoading } = useFetch(fetcher, {
    deps: [],
  });

  const filtered = q
    ? (transactions ?? []).filter((t) => {
        const merchant = (t.merchant ?? "").toLowerCase();
        const desc = (t.description ?? "").toLowerCase();
        const amount = String(t.amount ?? "");
        return merchant.includes(q) || desc.includes(q) || amount.includes(q);
      })
    : transactions ?? [];

  const list = [...filtered].sort((a, b) => {
    const da = new Date((a as Transaction).date).getTime();
    const db = new Date((b as Transaction).date).getTime();
    return db - da;
  });

  const total = list.length;
  const paginatedList = list.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  useEffect(() => {
    setPage(1);
  }, [q]);

  return (
    <div className="space-y-6 sm:space-y-8">
      <PageHeaderCard
        variant="stacked"
        title="Transactions"
        description="All transactions from your uploaded CSV files."
        showIdentifier={false}
        showDividers={false}
      />

      {isLoading ? (
        <LoadingState
          title="Loading transactions"
        />
      ) : list.length === 0 ? (
        <GlassCard className="p-8 text-center">
          <p className="text-[var(--muted)]">
            No transactions yet. Upload a CSV from the Upload page.
          </p>
        </GlassCard>
      ) : (
        <>
          <div className="space-y-3">
            {paginatedList.map((tx) => {
            const t = tx as Transaction;
            const merchant = t.merchant ?? t.description ?? "—";
            const date = t.date ? new Date(t.date).toLocaleDateString() : "—";
            const amount = Number(t.amount);
            const currency = t.currency ?? "INR";
            const formatted =
              currency === "INR"
                ? `₹${amount.toLocaleString("en-IN")}`
                : `${currency} ${amount.toFixed(2)}`;
            return (
              <GlassCard
                key={t.id}
                className="row-glass p-3 sm:p-4 flex flex-wrap items-center justify-between gap-3 sm:gap-4"
              >
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-[var(--foreground)] tracking-wide truncate">
                    {merchant}
                  </p>
                  <p className="text-xs sm:text-sm text-[var(--muted)]">
                    {formatted} · {date}
                  </p>
                </div>
                <span
                  className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${
                    amount > 1000
                      ? "border-rose-300 bg-rose-50 text-rose-800"
                      : "border-emerald-300 bg-emerald-50 text-emerald-800"
                  }`}
                >
                  {amount > 1000 ? "High charge" : "Normal"}
                </span>
              </GlassCard>
            );
          })}
          </div>
          <Pagination
            totalItems={total}
            pageSize={PAGE_SIZE}
            currentPage={page}
            onPageChange={setPage}
          />
        </>
      )}
    </div>
  );
}

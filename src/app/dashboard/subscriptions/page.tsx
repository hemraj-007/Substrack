"use client";

import { useCallback, useState, useEffect } from "react";
import { useFetch } from "@/hooks/useFetch";
import { subscriptionsApi, getApiErrorMessage, type Subscription } from "@/lib/api";
import { useSearchParams } from "next/navigation";
import { GlassCard } from "@/components/GlassCard";
import { Pagination } from "@/components/Pagination";
import { PageHeaderCard } from "@/components/PageHeaderCard";

const PAGE_SIZE = 5;

const STATUS_OPTIONS = [
  { value: "ACTIVE", label: "Active" },
  { value: "AT_RISK", label: "At risk" },
  { value: "CANCELED", label: "Canceled" },
  { value: "", label: "All" },
] as const;

export default function SubscriptionsPage() {
  const searchParams = useSearchParams();
  const initialFilter = (searchParams.get("filter") ?? "") as string;
  const q = (searchParams.get("q") ?? "").trim().toLowerCase();
  const [statusFilter, setStatusFilter] = useState(initialFilter || "ACTIVE");
  const [detecting, setDetecting] = useState(false);
  const [page, setPage] = useState(1);

  const fetcher = useCallback(
    () => subscriptionsApi.list().then((r) => r.data),
    []
  );
  const { data: subscriptions = [], isLoading, isError, error, refetch } = useFetch(fetcher, {
    deps: [],
  });

  async function handleDetect() {
    setDetecting(true);
    try {
      await subscriptionsApi.detect();
      refetch();
    } finally {
      setDetecting(false);
    }
  }

  const list = (subscriptions ?? []).filter((s: Subscription) => {
    if (q && !(s.merchant ?? "").toLowerCase().includes(q)) return false;
    if (!statusFilter) return true;
    return (s.status ?? "").toUpperCase() === statusFilter;
  });

  const sortByNext = [...list].sort((a, b) => {
    const aNext = a.nextCharge ? new Date(a.nextCharge).getTime() : 0;
    const bNext = b.nextCharge ? new Date(b.nextCharge).getTime() : 0;
    return aNext - bNext;
  });

  const total = sortByNext.length;
  const paginatedList = sortByNext.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  useEffect(() => {
    setPage(1);
  }, [statusFilter, q]);

  return (
    <div className="space-y-6 sm:space-y-8">
      <PageHeaderCard
        variant="stacked"
        title="Subscriptions"
        description="Recurring charges detected from your transactions."
        showIdentifier={false}
        showDividers={false}
        actions={
          <button
            type="button"
            onClick={handleDetect}
            disabled={detecting || isLoading}
            className="glow-button rounded-xl px-4 py-2.5 text-sm font-semibold disabled:opacity-50 inline-flex items-center justify-center gap-2"
          >
            {detecting && (
              <svg
                className="animate-spin size-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                aria-hidden
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            )}
            {detecting ? "Detecting…" : "Detect from transactions"}
          </button>
        }
      >
        <div className="flex flex-wrap items-center gap-2">
        {STATUS_OPTIONS.map(({ value, label }) => (
          <button
            key={value || "all"}
            type="button"
            onClick={() => setStatusFilter(value)}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
              statusFilter === value ? "pill-active" : "pill-inactive"
            }`}
          >
            {label}
          </button>
        ))}
        </div>
      </PageHeaderCard>

      {isError ? (
        <GlassCard className="p-6 space-y-3">
          <p className="text-sm text-red-600 dark:text-red-400">
            {getApiErrorMessage(error, {
              defaultMessage: "Could not load subscriptions. Check that the backend is running and try again.",
            })}
          </p>
          <button
            type="button"
            onClick={() => refetch()}
            className="glow-button rounded-xl px-4 py-2 text-sm font-semibold"
          >
            Retry
          </button>
        </GlassCard>
      ) : isLoading ? (
        <div className="text-[var(--muted)]">Loading subscriptions…</div>
      ) : sortByNext.length === 0 ? (
        <GlassCard className="p-8 text-center">
          <p className="text-[var(--muted)]">
            No subscriptions match. Upload transactions and run &quot;Detect from transactions&quot;.
          </p>
        </GlassCard>
      ) : (
        <>
          <div className="space-y-3">
            {paginatedList.map((sub) => (
              <GlassCard
                key={sub.id}
                className="row-glass p-3 sm:p-4 flex flex-wrap items-center justify-between gap-3 sm:gap-4"
              >
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-[var(--foreground)] tracking-wide truncate">
                    {sub.merchant ?? "—"}
                  </p>
                  <p className="text-sm text-[var(--muted)]">
                    ${Number(sub.amount ?? 0).toFixed(2)} · {(sub.frequency ?? "").toLowerCase()} · {String(sub.status ?? "").replace("_", " ")}
                  </p>
                  {sub.lastCharged && (
                    <p className="text-xs text-[var(--muted)]">
                      Last charged: {new Date(sub.lastCharged).toLocaleDateString()}
                    </p>
                  )}
                  {sub.nextCharge && (
                    <p className="text-xs text-[var(--muted)]">
                      Next: {new Date(sub.nextCharge).toLocaleDateString()}
                    </p>
                  )}
                </div>
                <span
                  className={`rounded-full border px-3 py-1 text-xs font-semibold ${
                    String(sub.status ?? "").toUpperCase() === "AT_RISK"
                      ? "border-amber-300 bg-amber-50 text-amber-800"
                      : "border-emerald-300 bg-emerald-50 text-emerald-800"
                  }`}
                >
                  {String(sub.status ?? "").replace("_", " ")}
                </span>
              </GlassCard>
            ))}
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

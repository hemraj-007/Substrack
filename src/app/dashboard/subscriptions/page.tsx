"use client";

import { useCallback, useState, useEffect } from "react";
import { useFetch } from "@/hooks/useFetch";
import { subscriptionsApi, getApiErrorMessage, type Subscription } from "@/lib/api";
import { useSearchParams } from "next/navigation";
import { LoadingState } from "@/components/Loader";
import { PageShell } from "@/components/ui/PageShell";
import { SubscriptionCard } from "@/components/ui/SubscriptionCard";
import { EmptyState } from "@/components/ui/EmptyState";
import Link from "next/link";
import {
  useCardFilterParams,
  useCardFilterQueryKey,
} from "@/hooks/useCardFilter";

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
  const [detectMessage, setDetectMessage] = useState("");
  const [detectError, setDetectError] = useState("");
  const cardKey = useCardFilterQueryKey();
  const cardParams = useCardFilterParams();

  const fetcher = useCallback(
    () => subscriptionsApi.list(cardParams).then((r) => r.data),
    [cardParams]
  );
  const { data: subscriptions = [], isLoading, isError, error, refetch } = useFetch(fetcher, {
    deps: [cardKey],
  });

  async function handleDetect() {
    setDetecting(true);
    setDetectMessage("");
    setDetectError("");
    try {
      const { data } = await subscriptionsApi.detect();
      const detectedCount = Array.isArray(data) ? data.length : 0;
      await refetch();
      setDetectMessage(
        detectedCount > 0
          ? `Detected ${detectedCount} active subscription${detectedCount === 1 ? "" : "s"}.`
          : "No subscription-like transactions were detected yet."
      );
    } catch (err: unknown) {
      setDetectError(
        getApiErrorMessage(err, {
          defaultMessage: "Could not detect subscriptions.",
        })
      );
    } finally {
      setDetecting(false);
    }
  }

  const list = (subscriptions ?? []).filter((s: Subscription) => {
    if (q && !(s.merchant ?? "").toLowerCase().includes(q)) return false;
    if (!statusFilter) return true;
    return (s.status ?? "").toUpperCase() === statusFilter;
  });

  useEffect(() => {
    setStatusFilter(initialFilter || "ACTIVE");
  }, [initialFilter]);

  return (
    <PageShell
      title="Subscriptions"
      description="Recurring charges detected from your transactions."
      actions={
        <button
          type="button"
          onClick={handleDetect}
          disabled={detecting || isLoading}
          className="glow-button rounded-xl px-4 py-2.5 text-sm font-semibold disabled:opacity-50"
        >
          {detecting ? "Detecting…" : "Detect from transactions"}
        </button>
      }
    >
      <div className="flex flex-wrap gap-2">
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

      {(detectMessage || detectError) && (
        <p
          className={`text-sm font-medium ${detectError ? "text-red-600" : "text-emerald-600"}`}
        >
          {detectError || detectMessage}
        </p>
      )}

      {isError ? (
        <div className="content-card p-6 space-y-3">
          <p className="text-sm text-red-600">{getApiErrorMessage(error)}</p>
          <button type="button" onClick={() => refetch()} className="glow-button rounded-xl px-4 py-2 text-sm">
            Retry
          </button>
        </div>
      ) : isLoading ? (
        <LoadingState title="Loading subscriptions" />
      ) : list.length === 0 ? (
        <EmptyState
          title="No subscriptions yet"
          description='Upload a statement and click "Detect from transactions".'
          action={
            <Link href="/dashboard/upload" className="glow-button inline-block rounded-xl px-4 py-2 text-sm font-semibold">
              Upload statement
            </Link>
          }
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {list.map((sub) => (
            <SubscriptionCard
              key={sub.id}
              sub={{
                id: sub.id,
                merchant: sub.merchant ?? "Unknown",
                amount: Number(sub.amount) || 0,
                frequency: sub.frequency,
                status: sub.status,
                nextCharge: sub.nextCharge,
                cardLast4: sub.card?.last4,
              }}
            />
          ))}
        </div>
      )}
    </PageShell>
  );
}

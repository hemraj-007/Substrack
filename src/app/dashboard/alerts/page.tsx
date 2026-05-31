"use client";

import { useState } from "react";
import { useFetch } from "@/hooks/useFetch";
import { alertsApi } from "@/lib/api";
import { AlertItem } from "@/components/AlertItem";
import { GlassCard } from "@/components/GlassCard";
import { LoadingState } from "@/components/Loader";
import { Pagination } from "@/components/Pagination";
import { PageHeaderCard } from "@/components/PageHeaderCard";

const PAGE_SIZE = 5;

export default function AlertsPage() {
  const [page, setPage] = useState(1);
  const { data: alerts = [], isLoading, error } = useFetch(
    () => alertsApi.list().then((r) => r.data),
    { deps: [] }
  );

  if (isLoading) {
    return (
      <LoadingState
        title="Loading alerts"
      />
    );
  }

  if (error) {
    return (
      <GlassCard className="p-4 border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-300">
        Failed to load alerts.
      </GlassCard>
    );
  }

  const list = [...(alerts ?? [])].sort(
    (a, b) =>
      new Date(a.scheduledAt ?? 0).getTime() -
      new Date(b.scheduledAt ?? 0).getTime()
  );
  const total = list.length;
  const paginatedList = list.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="space-y-6 sm:space-y-8">
      <PageHeaderCard
        variant="stacked"
        title="Alerts"
        description="Renewal reminders, unused subscription warnings, and future price hike alerts."
        showIdentifier={false}
        showDividers={false}
      />

      {list.length === 0 ? (
        <GlassCard className="p-8 text-center">
          <p className="text-[var(--muted)]">No alerts yet.</p>
        </GlassCard>
      ) : (
        <>
          <div className="space-y-3">
            {paginatedList.map((alert) => (
              <AlertItem key={alert.id} alert={alert} />
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

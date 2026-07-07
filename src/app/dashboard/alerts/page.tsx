"use client";

import { useMemo } from "react";
import { useFetch } from "@/hooks/useFetch";
import { alertsApi, type Alert } from "@/lib/api";
import { AlertItem } from "@/components/AlertItem";
import { LoadingState } from "@/components/Loader";
import { PageShell } from "@/components/ui/PageShell";
import { EmptyState } from "@/components/ui/EmptyState";
import { SectionHeader } from "@/components/ui/SectionHeader";

const GROUP_ORDER: Alert["type"][] = ["RENEWAL", "PRICE_HIKE", "UNUSED"];
const GROUP_LABELS: Record<Alert["type"], string> = {
  RENEWAL: "Renewals",
  PRICE_HIKE: "Price increases",
  UNUSED: "Unused subscriptions",
};

export default function AlertsPage() {
  const { data: alerts = [], isLoading, error } = useFetch(
    () => alertsApi.list().then((r) => r.data),
    { deps: [] }
  );

  const grouped = useMemo(() => {
    const map = new Map<Alert["type"], Alert[]>();
    for (const type of GROUP_ORDER) map.set(type, []);
    for (const alert of alerts ?? []) {
      const bucket = map.get(alert.type) ?? [];
      bucket.push(alert);
      map.set(alert.type, bucket);
    }
    for (const [, items] of map) {
      items.sort(
        (a, b) =>
          new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime()
      );
    }
    return map;
  }, [alerts]);

  if (isLoading) return <LoadingState title="Loading alerts" />;
  if (error) {
    return (
      <div className="content-card p-6 text-red-600 text-sm">Failed to load alerts.</div>
    );
  }

  const total = (alerts ?? []).length;

  return (
    <PageShell
      title="Alerts"
      description="Renewal reminders, unused subscription warnings, and price hike notices."
    >
      {total === 0 ? (
        <EmptyState
          title="No alerts yet"
          description="Run subscription detection or wait for the daily renewal check after you have active subscriptions."
        />
      ) : (
        <div className="space-y-8">
          {GROUP_ORDER.map((type) => {
            const items = grouped.get(type) ?? [];
            if (items.length === 0) return null;
            return (
              <section key={type}>
                <SectionHeader title={GROUP_LABELS[type]} />
                <div className="space-y-3">
                  {items.map((alert) => (
                    <AlertItem key={alert.id} alert={alert} />
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      )}
    </PageShell>
  );
}

"use client";

import { useMemo } from "react";
import { useFetch } from "@/hooks/useFetch";
import { subscriptionsApi } from "@/lib/api";
import { LoadingState } from "@/components/Loader";
import { PageShell } from "@/components/ui/PageShell";
import { CalendarGrid } from "@/components/ui/CalendarGrid";
import { useCardFilterParams, useCardFilterQueryKey } from "@/hooks/useCardFilter";

export default function RenewalsPage() {
  const cardKey = useCardFilterQueryKey();
  const cardParams = useCardFilterParams();

  const { data: summary, isLoading, error } = useFetch(
    () => subscriptionsApi.summary(cardParams).then((r) => r.data),
    { deps: [cardKey] }
  );

  const renewals = useMemo(() => {
    const items = summary?.upcoming.next30Days ?? [];
    return items.map((item) => ({
      date: item.nextCharge,
      merchant: item.merchant,
      amount: item.amount,
    }));
  }, [summary]);

  if (isLoading) return <LoadingState title="Loading renewals" />;
  if (error) {
    return <div className="content-card p-6 text-red-600 text-sm">Failed to load renewals.</div>;
  }

  return (
    <PageShell
      title="Renewals"
      description="Calendar view of upcoming subscription charges."
    >
      <CalendarGrid renewals={renewals} />
      {renewals.length > 0 && (
        <div className="content-card p-4 sm:p-6 mt-4">
          <h3 className="font-semibold text-[var(--foreground)] mb-3">This month</h3>
          <ul className="space-y-2">
            {renewals.map((r, i) => (
              <li
                key={`${r.date}-${r.merchant}-${i}`}
                className="flex justify-between text-sm py-2 border-b border-[var(--border)] last:border-0"
              >
                <span className="text-[var(--foreground)]">{r.merchant}</span>
                <span className="text-[var(--muted)]">
                  {new Date(r.date).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                  })}{" "}
                  · ₹{r.amount.toLocaleString("en-IN")}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </PageShell>
  );
}

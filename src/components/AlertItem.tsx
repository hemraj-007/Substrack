"use client";

import type { Alert } from "@/lib/api";

type AlertItemProps = { alert: Alert };

const typeLabel: Record<Alert["type"], string> = {
  RENEWAL: "Renewal",
  PRICE_HIKE: "Price hike",
  UNUSED: "Unused",
};

const typeClass: Record<Alert["type"], string> = {
  RENEWAL: "border border-emerald-300 bg-emerald-50 text-emerald-800",
  PRICE_HIKE: "border border-amber-300 bg-amber-50 text-amber-800",
  UNUSED: "border border-slate-300 bg-slate-100 text-slate-700",
};

export function AlertItem({ alert }: AlertItemProps) {
  return (
    <div className="glass-card row-glass rounded-xl sm:rounded-2xl backdrop-blur-xl p-3 sm:p-4">
      <div className="flex items-center gap-2 mb-2">
        <span
          className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${typeClass[alert.type]}`}
        >
          {typeLabel[alert.type]}
        </span>
        {alert.scheduledAt && (
          <span className="text-xs text-[var(--muted)]">
            {new Date(alert.scheduledAt).toLocaleDateString()}
          </span>
        )}
      </div>
      <p className="text-sm">{alert.message}</p>
      {alert.sentAt && (
        <p className="text-xs text-[var(--muted)] mt-2">
          Sent {new Date(alert.sentAt).toLocaleString()}
        </p>
      )}
    </div>
  );
}

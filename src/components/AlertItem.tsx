"use client";

import type { Alert } from "@/lib/api";
import { StatusBadge, alertTypeToVariant } from "@/components/ui/StatusBadge";

type AlertItemProps = { alert: Alert };

export function AlertItem({ alert }: AlertItemProps) {
  return (
    <div className="content-card p-4 flex flex-col sm:flex-row sm:items-center gap-3">
      <div className="flex items-center gap-2 shrink-0">
        <StatusBadge variant={alertTypeToVariant(alert.type)} />
        {alert.scheduledAt && (
          <span className="text-xs text-[var(--muted)]">
            {new Date(alert.scheduledAt).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </span>
        )}
      </div>
      <p className="text-sm text-[var(--foreground)] flex-1">{alert.message}</p>
    </div>
  );
}

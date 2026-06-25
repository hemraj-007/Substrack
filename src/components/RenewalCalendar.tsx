"use client";

import { useState } from "react";
import type { UpcomingRenewal } from "@/lib/api";
import { formatInr } from "@/lib/currency";

type RenewalWindow = "7" | "30";

function formatRenewalDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

function daysUntil(iso: string): number {
  const target = new Date(iso);
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  target.setHours(0, 0, 0, 0);
  return Math.round((target.getTime() - now.getTime()) / (24 * 60 * 60 * 1000));
}

function relativeLabel(days: number): string {
  if (days === 0) return "Today";
  if (days === 1) return "Tomorrow";
  if (days > 1) return `In ${days} days`;
  return "Past due";
}

type Props = {
  next7Days: UpcomingRenewal[];
  next30Days: UpcomingRenewal[];
};

export function RenewalCalendar({ next7Days, next30Days }: Props) {
  const [window, setWindow] = useState<RenewalWindow>("7");
  const items = window === "7" ? next7Days : next30Days;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {(
          [
            { value: "7" as const, label: "Next 7 days", count: next7Days.length },
            { value: "30" as const, label: "Next 30 days", count: next30Days.length },
          ] as const
        ).map(({ value, label, count }) => (
          <button
            key={value}
            type="button"
            onClick={() => setWindow(value)}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
              window === value ? "pill-active" : "pill-inactive"
            }`}
          >
            {label}
            <span className="ml-1.5 opacity-70">({count})</span>
          </button>
        ))}
      </div>

      {items.length === 0 ? (
        <p className="text-sm text-[var(--muted)]">
          No renewals in the next {window} days. You&apos;re clear for now.
        </p>
      ) : (
        <ul className="space-y-2">
          {items.map((item) => {
            const days = daysUntil(item.nextCharge);
            return (
              <li
                key={item.id}
                className="flex items-center justify-between gap-3 rounded-xl border border-[var(--border)] bg-[var(--glass)] backdrop-blur-sm px-3 py-3 sm:px-4"
              >
                <div className="min-w-0">
                  <p className="font-semibold text-[var(--foreground)] truncate">
                    {item.merchant}
                  </p>
                  <p className="text-xs text-[var(--muted)] mt-0.5">
                    {formatRenewalDate(item.nextCharge)} · {relativeLabel(days)}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-bold text-[var(--foreground)]">
                    {formatInr(item.amount)}
                  </p>
                  {item.status === "AT_RISK" && (
                    <p className="text-xs text-amber-400 mt-0.5">At risk</p>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

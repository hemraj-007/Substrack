"use client";

import { useMemo, useState } from "react";
import { formatInr } from "@/lib/currency";

export type RenewalDay = {
  date: string;
  merchant: string;
  amount: number;
};

type Props = {
  renewals: RenewalDay[];
};

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function CalendarGrid({ renewals }: Props) {
  const [cursor, setCursor] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });

  const byDay = useMemo(() => {
    const map = new Map<string, RenewalDay[]>();
    for (const r of renewals) {
      const key = r.date.slice(0, 10);
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(r);
    }
    return map;
  }, [renewals]);

  const year = cursor.getFullYear();
  const month = cursor.getMonth();
  const monthLabel = cursor.toLocaleString("default", { month: "long", year: "numeric" });
  const firstDow = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells: Array<{ day: number | null; key: string }> = [];
  for (let i = 0; i < firstDow; i++) cells.push({ day: null, key: `pad-${i}` });
  for (let d = 1; d <= daysInMonth; d++) {
    const key = `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    cells.push({ day: d, key });
  }

  function shiftMonth(delta: number) {
    setCursor(new Date(year, month + delta, 1));
  }

  return (
    <div className="content-card p-4 sm:p-6">
      <div className="flex items-center justify-between mb-4">
        <button
          type="button"
          onClick={() => shiftMonth(-1)}
          className="rounded-lg border border-[var(--border)] px-3 py-1.5 text-sm hover:bg-[var(--surface-muted)]"
        >
          ←
        </button>
        <h3 className="font-semibold text-[var(--foreground)]">{monthLabel}</h3>
        <button
          type="button"
          onClick={() => shiftMonth(1)}
          className="rounded-lg border border-[var(--border)] px-3 py-1.5 text-sm hover:bg-[var(--surface-muted)]"
        >
          →
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium text-[var(--muted)] mb-2">
        {WEEKDAYS.map((w) => (
          <div key={w} className="py-1">
            {w}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {cells.map(({ day, key }) => {
          if (day === null) {
            return <div key={key} className="aspect-square" />;
          }
          const items = byDay.get(key) ?? [];
          const hasRenewal = items.length > 0;
          return (
            <div
              key={key}
              className={`aspect-square rounded-lg border text-xs flex flex-col items-center justify-start p-1 ${
                hasRenewal
                  ? "border-[var(--accent)]/40 bg-[var(--accent-subtle)]"
                  : "border-transparent hover:bg-[var(--surface-muted)]"
              }`}
              title={items.map((i) => `${i.merchant} ${formatInr(i.amount)}`).join(", ")}
            >
              <span className="font-medium text-[var(--foreground)]">{day}</span>
              {hasRenewal && (
                <span className="mt-0.5 w-1.5 h-1.5 rounded-full bg-[var(--accent)]" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import type { ReactNode } from "react";

function parseNumeric(value: string | number): number | null {
  if (typeof value === "number") return value;
  const n = Number(String(value).replace(/[^\d.-]/g, ""));
  return Number.isFinite(n) ? n : null;
}

export function CountUp({
  value,
  format,
}: {
  value: string | number;
  format?: (n: number) => string;
}) {
  const target = parseNumeric(value);
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    if (target === null) {
      setDisplay(value);
      return;
    }
    let frame = 0;
    const total = 24;
    const start = 0;
    const tick = () => {
      frame += 1;
      const progress = frame / total;
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = start + (target - start) * eased;
      setDisplay(format ? format(current) : Math.round(current).toString());
      if (frame < total) requestAnimationFrame(tick);
      else setDisplay(value);
    };
    requestAnimationFrame(tick);
  }, [value, target, format]);

  return <>{display}</>;
}

export function KpiCard({
  label,
  value,
  comparison,
  icon,
}: {
  label: string;
  value: string | number;
  comparison?: string;
  icon: ReactNode;
}) {
  return (
    <div className="dash-card dash-card-hover p-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm text-slate-500 font-medium">{label}</p>
          <p className="mt-2 text-3xl lg:text-4xl font-bold text-slate-900 tracking-tight">
            <CountUp value={value} />
          </p>
          {comparison && (
            <p className="mt-2 text-xs font-medium text-emerald-500">{comparison}</p>
          )}
        </div>
        <div className="w-10 h-10 rounded-xl bg-violet-50 text-[#5B5CEB] flex items-center justify-center shrink-0">
          {icon}
        </div>
      </div>
    </div>
  );
}

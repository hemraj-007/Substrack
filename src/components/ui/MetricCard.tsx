import type { ReactNode } from "react";

type Props = {
  label: string;
  value: string | number;
  subtext?: string;
  icon?: ReactNode;
  trend?: { value: string; positive?: boolean };
  className?: string;
};

export function MetricCard({ label, value, subtext, icon, trend, className = "" }: Props) {
  return (
    <div className={`content-card p-4 sm:p-5 ${className}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm text-[var(--muted)]">{label}</p>
          <p className="mt-1 text-2xl sm:text-3xl font-bold text-[var(--foreground)] tracking-tight">
            {value}
          </p>
          {subtext && (
            <p className="mt-1 text-xs text-[var(--muted)]">{subtext}</p>
          )}
          {trend && (
            <p
              className={`mt-1 text-xs font-medium ${
                trend.positive ? "text-[var(--success)]" : "text-[var(--danger)]"
              }`}
            >
              {trend.value}
            </p>
          )}
        </div>
        {icon && (
          <div className="shrink-0 w-10 h-10 rounded-xl bg-[var(--accent-subtle)] text-[var(--accent)] flex items-center justify-center">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}

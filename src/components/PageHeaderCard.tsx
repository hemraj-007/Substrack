"use client";

import { useMemo } from "react";
import type { ReactNode } from "react";

function pseudoCardNumber(seed: string): string {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i += 1) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  const digits: string[] = [];
  let x = h >>> 0;
  for (let i = 0; i < 12; i += 1) {
    x = (Math.imul(x, 1664525) + 1013904223) >>> 0;
    digits.push(String(x % 10));
  }
  const a = digits.slice(0, 4).join("");
  const b = digits.slice(4, 8).join("");
  const c = digits.slice(8, 12).join("");
  return `${a} ${b} ${c} ••••`;
}

type PageHeaderCardProps = {
  title: string;
  description?: string;
  children?: ReactNode;
  /** Optional actions (e.g. primary button) shown on the right on larger screens */
  actions?: ReactNode;
  className?: string;
  showIdentifier?: boolean;
  showDividers?: boolean;
  /**
   * `stacked` — hero card: title, description, PAN-style line, then children (e.g. filters).
   * `default` — magnetic stripe, chip, title on top.
   */
  variant?: "default" | "stacked";
};

/**
 * Page header as a card: default uses stripe + chip; stacked uses a lavender hero card.
 */
export function PageHeaderCard({
  title,
  description,
  children,
  actions,
  className = "",
  variant = "default",
  showIdentifier = true,
  showDividers = true,
}: PageHeaderCardProps) {
  const panDisplay = useMemo(() => pseudoCardNumber(title), [title]);

  if (variant === "stacked") {
    return (
      <div className={`relative isolate ${className}`}>
        <div
          className="relative overflow-hidden rounded-2xl border border-white/90 px-4 py-3.5 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05),0_12px_32px_-8px_rgba(0,0,0,0.08),0_0_0_1px_rgba(0,0,0,0.02)] sm:px-5 sm:py-4"
          style={{
            background:
              "linear-gradient(165deg, #f8f7fc 0%, #f1eff8 45%, #ebe8f4 100%)",
          }}
        >
          {showDividers ? (
            <div
              className="absolute left-0 right-0 top-0 h-0.5 bg-gradient-to-r from-[var(--accent)] via-[var(--accent-2)] to-[var(--chart-purple)] opacity-90"
              aria-hidden
            />
          ) : null}

          <div className="flex w-full flex-col gap-3 lg:flex-row lg:items-start lg:justify-between lg:gap-4">
            <div className="grid min-w-0 w-full flex-1 gap-2 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center sm:gap-x-5 lg:gap-x-8">
              <div className="min-w-0">
                <h1 className="text-xl font-extrabold tracking-tight text-[#2c3544] sm:text-2xl">
                  {title}
                </h1>
                {description ? (
                  <p className="mt-1 max-w-xl text-sm leading-snug text-[var(--muted)]">{description}</p>
                ) : null}
              </div>
              {showIdentifier ? (
                <p
                  className="mt-3 border-t border-[#d4d0e8]/80 pt-3 font-mono text-base font-bold tracking-[0.14em] text-[#1c1e24] sm:mt-0 sm:border-0 sm:pt-0 sm:text-right sm:text-lg sm:tracking-[0.18em] sm:tabular-nums whitespace-nowrap"
                  aria-label="Display identifier"
                >
                  {panDisplay}
                </p>
              ) : null}
            </div>
            {actions ? <div className="shrink-0 sm:pt-0.5">{actions}</div> : null}
          </div>

          {children ? (
            <div
              className={`mt-3 flex flex-wrap gap-2 sm:mt-3 ${
                showDividers ? "border-t border-[#d4d0e8]/60 pt-3" : ""
              }`}
            >
              {children}
            </div>
          ) : null}
        </div>
      </div>
    );
  }

  return (
    <div className={`page-header-card backdrop-blur-xl pt-4 pb-4 pl-5 pr-4 sm:pt-5 sm:pb-5 sm:pl-6 sm:pr-5 ${className}`}>
      <div
        className="absolute right-4 top-4 sm:right-5 sm:top-5 w-9 h-7 rounded-md bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 shadow-inner border border-amber-300/50"
        style={{ boxShadow: "inset 0 1px 0 rgba(255,255,255,0.35), 0 1px 2px rgba(0,0,0,0.2)" }}
        aria-hidden
      />
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-3 sm:gap-4 relative z-[1]">
        <div className="min-w-0">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[var(--foreground)] pr-12 sm:pr-14">
            {title}
          </h1>
          {description && (
            <p className="mt-1.5 sm:mt-2 text-sm text-[var(--muted)] max-w-xl">
              {description}
            </p>
          )}
          {children && (
            <div className="flex flex-wrap gap-2 mt-3 sm:mt-4">
              {children}
            </div>
          )}
        </div>
        {actions && (
          <div className="shrink-0 flex items-center sm:pt-1">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
}

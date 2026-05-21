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

type HeaderVisual = {
  label: string;
  sublabel: string;
  tags: string[];
  icon: ReactNode;
};

function iconFor(name: "dashboard" | "cards" | "transactions" | "subscriptions" | "alerts" | "upload" | "account" | "settings" | "privacy" | "default") {
  switch (name) {
    case "dashboard":
      return (
        <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
          <rect x="3" y="3" width="8" height="8" rx="2" />
          <rect x="13" y="3" width="8" height="5" rx="2" />
          <rect x="13" y="10" width="8" height="11" rx="2" />
          <rect x="3" y="13" width="8" height="8" rx="2" />
        </svg>
      );
    case "cards":
      return (
        <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
          <rect x="2.5" y="5" width="19" height="14" rx="3" />
          <path d="M3.5 10h17" />
          <path d="M7 15h3" />
        </svg>
      );
    case "transactions":
      return (
        <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
          <path d="M4 7h16M4 12h10M4 17h7" />
          <path d="M18 15l3 3-3 3" />
        </svg>
      );
    case "subscriptions":
      return (
        <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
          <path d="M4 7h16M4 12h16M4 17h16" />
          <circle cx="8" cy="7" r="1.2" fill="currentColor" stroke="none" />
          <circle cx="15" cy="12" r="1.2" fill="currentColor" stroke="none" />
          <circle cx="11" cy="17" r="1.2" fill="currentColor" stroke="none" />
        </svg>
      );
    case "alerts":
      return (
        <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
          <path d="M12 3c-3.3 0-6 2.7-6 6v3.6L4 16h16l-2-3.4V9c0-3.3-2.7-6-6-6z" />
          <path d="M9.5 19a2.5 2.5 0 005 0" />
        </svg>
      );
    case "upload":
      return (
        <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
          <path d="M12 15V5" />
          <path d="M8 9l4-4 4 4" />
          <path d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2" />
        </svg>
      );
    case "account":
      return (
        <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
          <circle cx="12" cy="8" r="3.2" />
          <path d="M5 20c1.8-3.3 4.2-4.8 7-4.8S17.2 16.7 19 20" />
        </svg>
      );
    case "settings":
      return (
        <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
          <path d="M12 8.8A3.2 3.2 0 1112 15.2 3.2 3.2 0 0112 8.8z" />
          <path d="M19.4 15a1 1 0 00.2 1.1l.1.1a1 1 0 010 1.4l-1.3 1.3a1 1 0 01-1.4 0l-.1-.1a1 1 0 00-1.1-.2 1 1 0 00-.6.9V20a1 1 0 01-1 1h-2a1 1 0 01-1-1v-.2a1 1 0 00-.6-.9 1 1 0 00-1.1.2l-.1.1a1 1 0 01-1.4 0L4.3 18a1 1 0 010-1.4l.1-.1a1 1 0 00.2-1.1 1 1 0 00-.9-.6H3.5a1 1 0 01-1-1v-2a1 1 0 011-1h.2a1 1 0 00.9-.6 1 1 0 00-.2-1.1l-.1-.1a1 1 0 010-1.4L5.6 4a1 1 0 011.4 0l.1.1a1 1 0 001.1.2 1 1 0 00.6-.9V3.2a1 1 0 011-1h2a1 1 0 011 1v.2a1 1 0 00.6.9 1 1 0 001.1-.2l.1-.1a1 1 0 011.4 0l1.3 1.3a1 1 0 010 1.4l-.1.1a1 1 0 00-.2 1.1 1 1 0 00.9.6h.2a1 1 0 011 1v2a1 1 0 01-1 1h-.2a1 1 0 00-.9.6z" />
        </svg>
      );
    case "privacy":
      return (
        <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
          <path d="M12 3l7 3v5c0 4.8-2.8 7.9-7 10-4.2-2.1-7-5.2-7-10V6l7-3z" />
          <path d="M9.5 12.5l2 2 3-3.5" />
        </svg>
      );
    default:
      return (
        <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
          <rect x="4" y="4" width="16" height="16" rx="3" />
          <path d="M8 10h8M8 14h5" />
        </svg>
      );
  }
}

function getHeaderVisual(title: string): HeaderVisual {
  const normalized = title.toLowerCase();

  if (normalized.includes("financial") || normalized.includes("dashboard") || normalized.includes("command center")) {
    return {
      label: "Overview",
      sublabel: "Spend, renewals, and savings at a glance",
      tags: ["Insights", "Trends", "Action"],
      icon: iconFor("dashboard"),
    };
  }
  if (normalized.includes("card")) {
    return {
      label: "Cards",
      sublabel: "Manage payment methods and coverage",
      tags: ["Payment", "Issuers", "Networks"],
      icon: iconFor("cards"),
    };
  }
  if (normalized.includes("transaction")) {
    return {
      label: "Transactions",
      sublabel: "Track billing flows and spending history",
      tags: ["Charges", "History", "Filters"],
      icon: iconFor("transactions"),
    };
  }
  if (normalized.includes("subscription")) {
    return {
      label: "Subscriptions",
      sublabel: "Control recurring services and renewals",
      tags: ["Recurring", "Renewals", "Risk"],
      icon: iconFor("subscriptions"),
    };
  }
  if (normalized.includes("alert")) {
    return {
      label: "Alerts",
      sublabel: "Monitor critical updates and reminders",
      tags: ["Warnings", "Deadlines", "Priority"],
      icon: iconFor("alerts"),
    };
  }
  if (normalized.includes("upload")) {
    return {
      label: "Upload",
      sublabel: "Add fresh statements for better detection",
      tags: ["CSV", "Sync", "Refresh"],
      icon: iconFor("upload"),
    };
  }
  if (normalized.includes("account") || normalized.includes("profile")) {
    return {
      label: "Account",
      sublabel: "Identity and plan details",
      tags: ["Profile", "Plan", "Security"],
      icon: iconFor("account"),
    };
  }
  if (normalized.includes("setting")) {
    return {
      label: "Settings",
      sublabel: "Tune experience and notifications",
      tags: ["Preferences", "Alerts", "Display"],
      icon: iconFor("settings"),
    };
  }
  if (normalized.includes("privacy")) {
    return {
      label: "Privacy",
      sublabel: "Data use and protection controls",
      tags: ["Policy", "Consent", "Security"],
      icon: iconFor("privacy"),
    };
  }

  return {
    label: "Workspace",
    sublabel: "Contextual actions for this page",
    tags: ["Overview", "Details", "Actions"],
    icon: iconFor("default"),
  };
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
  const visual = useMemo(() => getHeaderVisual(title), [title]);

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
            <div className="hidden lg:block lg:w-[280px] lg:shrink-0">
              <div className="rounded-xl border border-white/90 bg-white/65 p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]">
                <div className="flex items-start gap-3">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-[var(--accent)] to-[var(--accent-2)] text-white">
                    {visual.icon}
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-[#273247]">{visual.label}</p>
                    <p className="mt-0.5 text-xs leading-5 text-[var(--muted)]">{visual.sublabel}</p>
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {visual.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-[#d4d0e8] bg-white/70 px-2 py-0.5 text-[11px] font-medium text-[#35435b]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
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
        <div className="hidden lg:block lg:w-[260px] lg:shrink-0">
          <div className="rounded-xl border border-[var(--border)] bg-[var(--glass)] p-3">
            <div className="flex items-start gap-3">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-[var(--accent)] to-[var(--accent-2)] text-white">
                {visual.icon}
              </span>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-[var(--foreground)]">{visual.label}</p>
                <p className="mt-0.5 text-xs leading-5 text-[var(--muted)]">{visual.sublabel}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

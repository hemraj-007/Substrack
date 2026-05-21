"use client";

import { useState } from "react";
import { GlassCard } from "@/components/GlassCard";
import { PageHeaderCard } from "@/components/PageHeaderCard";

export default function SettingsPage() {
  const [compactMode, setCompactMode] = useState(false);
  const [renewalAlerts, setRenewalAlerts] = useState(true);
  const [weeklyDigest, setWeeklyDigest] = useState(true);

  return (
    <div className="space-y-6 sm:space-y-8">
      <PageHeaderCard
        variant="stacked"
        title="Settings"
        description="Customize your dashboard and notification preferences."
        showIdentifier={false}
        showDividers={false}
      />

      <GlassCard className="p-4 sm:p-6 space-y-5">
        <h2 className="text-base sm:text-lg font-semibold text-[var(--foreground)]">
          Preferences
        </h2>

        <label className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-[var(--foreground)]">
              Compact dashboard cards
            </p>
            <p className="text-xs text-[var(--muted)] mt-1">
              Reduce padding and spacing to fit more data on screen.
            </p>
          </div>
          <input
            type="checkbox"
            checked={compactMode}
            onChange={(e) => setCompactMode(e.target.checked)}
            className="mt-1 h-4 w-4 accent-[var(--accent)]"
          />
        </label>

        <label className="flex items-start justify-between gap-4 border-t border-[var(--border)]/60 pt-4">
          <div>
            <p className="text-sm font-medium text-[var(--foreground)]">
              Renewal alerts
            </p>
            <p className="text-xs text-[var(--muted)] mt-1">
              Notify before upcoming subscription renewals.
            </p>
          </div>
          <input
            type="checkbox"
            checked={renewalAlerts}
            onChange={(e) => setRenewalAlerts(e.target.checked)}
            className="mt-1 h-4 w-4 accent-[var(--accent)]"
          />
        </label>

        <label className="flex items-start justify-between gap-4 border-t border-[var(--border)]/60 pt-4">
          <div>
            <p className="text-sm font-medium text-[var(--foreground)]">
              Weekly digest
            </p>
            <p className="text-xs text-[var(--muted)] mt-1">
              Receive weekly summary of spend trends and savings opportunities.
            </p>
          </div>
          <input
            type="checkbox"
            checked={weeklyDigest}
            onChange={(e) => setWeeklyDigest(e.target.checked)}
            className="mt-1 h-4 w-4 accent-[var(--accent)]"
          />
        </label>
      </GlassCard>
    </div>
  );
}

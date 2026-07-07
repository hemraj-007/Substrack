"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { PageShell } from "@/components/ui/PageShell";

const TABS = ["Profile", "Preferences", "Notifications", "Security", "Billing", "Data"] as const;

export default function SettingsPage() {
  const { user } = useAuth();
  const [tab, setTab] = useState<(typeof TABS)[number]>("Profile");
  const [compactMode, setCompactMode] = useState(false);
  const [renewalAlerts, setRenewalAlerts] = useState(true);
  const [weeklyDigest, setWeeklyDigest] = useState(true);

  return (
    <PageShell title="Settings" description="Manage your account and preferences.">
      <div className="flex flex-col lg:flex-row gap-6">
        <nav className="flex lg:flex-col gap-1 overflow-x-auto lg:w-48 shrink-0">
          {TABS.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={`whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium text-left transition ${
                tab === t
                  ? "bg-[var(--accent-subtle)] text-[var(--accent)]"
                  : "text-[var(--muted)] hover:bg-[var(--surface-muted)]"
              }`}
            >
              {t}
            </button>
          ))}
        </nav>

        <div className="content-card p-6 flex-1 min-w-0">
          {tab === "Profile" && (
            <div className="space-y-4 max-w-md">
              <h2 className="font-semibold">Profile</h2>
              <div>
                <label className="text-xs text-[var(--muted)]">Email</label>
                <p className="font-medium mt-1">{user?.email ?? "—"}</p>
              </div>
              <div>
                <label className="text-xs text-[var(--muted)]">Plan</label>
                <p className="font-medium mt-1 capitalize">{user?.plan ?? "Free"}</p>
              </div>
              <Link href="/dashboard/profile" className="text-sm text-[var(--accent)] hover:underline">
                View full account →
              </Link>
            </div>
          )}

          {tab === "Preferences" && (
            <div className="space-y-4 max-w-md">
              <h2 className="font-semibold">Preferences</h2>
              <label className="flex items-center justify-between gap-4">
                <span className="text-sm">Compact dashboard cards</span>
                <input
                  type="checkbox"
                  checked={compactMode}
                  onChange={(e) => setCompactMode(e.target.checked)}
                  className="h-4 w-4 accent-[var(--accent)]"
                />
              </label>
            </div>
          )}

          {tab === "Notifications" && (
            <div className="space-y-4 max-w-md">
              <h2 className="font-semibold">Notifications</h2>
              <label className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium">Renewal alerts</p>
                  <p className="text-xs text-[var(--muted)]">Before upcoming charges</p>
                </div>
                <input
                  type="checkbox"
                  checked={renewalAlerts}
                  onChange={(e) => setRenewalAlerts(e.target.checked)}
                  className="h-4 w-4 accent-[var(--accent)]"
                />
              </label>
              <label className="flex items-center justify-between gap-4 border-t border-[var(--border)] pt-4">
                <div>
                  <p className="text-sm font-medium">Weekly digest</p>
                  <p className="text-xs text-[var(--muted)]">Spend summary each week</p>
                </div>
                <input
                  type="checkbox"
                  checked={weeklyDigest}
                  onChange={(e) => setWeeklyDigest(e.target.checked)}
                  className="h-4 w-4 accent-[var(--accent)]"
                />
              </label>
              <p className="text-xs text-[var(--muted)]">Saved locally for now — sync coming soon.</p>
            </div>
          )}

          {(tab === "Security" || tab === "Billing" || tab === "Data") && (
            <div className="space-y-2">
              <h2 className="font-semibold">{tab}</h2>
              <p className="text-sm text-[var(--muted)]">
                {tab} settings will be available in a future update.
              </p>
            </div>
          )}
        </div>
      </div>
    </PageShell>
  );
}

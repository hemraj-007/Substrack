"use client";

import { useAuth } from "@/hooks/useAuth";
import { GlassCard } from "@/components/GlassCard";
import { PageHeaderCard } from "@/components/PageHeaderCard";

export default function ProfilePage() {
  const { user } = useAuth();

  return (
    <div className="space-y-6 sm:space-y-8">
      <PageHeaderCard
        variant="stacked"
        title="Account"
        description="Review your account details and subscription plan."
        showIdentifier={false}
        showDividers={false}
      />

      <GlassCard className="p-4 sm:p-6">
        <h2 className="text-base sm:text-lg font-semibold text-[var(--foreground)]">
          Profile details
        </h2>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-[var(--muted)]">Email</p>
            <p className="mt-1 text-[var(--foreground)] font-medium break-all">
              {user?.email ?? "Not available"}
            </p>
          </div>
          <div>
            <p className="text-[var(--muted)]">Plan</p>
            <p className="mt-1 text-[var(--foreground)] font-medium">
              {user?.plan ?? "Free"}
            </p>
          </div>
          <div>
            <p className="text-[var(--muted)]">User ID</p>
            <p className="mt-1 text-[var(--foreground)] font-medium break-all">
              {user?.id ?? "Not available"}
            </p>
          </div>
          <div>
            <p className="text-[var(--muted)]">Member since</p>
            <p className="mt-1 text-[var(--foreground)] font-medium">
              {user?.createdAt
                ? new Date(user.createdAt).toLocaleDateString()
                : "Not available"}
            </p>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}

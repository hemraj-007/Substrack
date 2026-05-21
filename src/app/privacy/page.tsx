import Link from "next/link";
import { GlassCard } from "@/components/GlassCard";
import { PageHeaderCard } from "@/components/PageHeaderCard";

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8 px-4 py-6 sm:px-6 sm:py-8">
      <PageHeaderCard
        variant="stacked"
        title="Privacy Policy"
        description="How Subscription Guardian handles your account and billing data."
        showIdentifier={false}
        showDividers={false}
      />

      <GlassCard className="p-4 sm:p-6 space-y-5 text-sm leading-6 text-[var(--foreground)]">
        <section>
          <h2 className="font-semibold text-base mb-2">Data we store</h2>
          <p className="text-[var(--muted)]">
            We store account information, uploaded transaction details, and inferred
            subscription metadata to power dashboards, reminders, and alerts.
          </p>
        </section>

        <section>
          <h2 className="font-semibold text-base mb-2">How data is used</h2>
          <p className="text-[var(--muted)]">
            Data is used only to provide product features such as spend tracking,
            recurring charge detection, and risk notifications.
          </p>
        </section>

        <section>
          <h2 className="font-semibold text-base mb-2">Your controls</h2>
          <p className="text-[var(--muted)]">
            You can remove cards, transactions, and subscriptions from the dashboard
            at any time. For account-level deletion requests, contact support.
          </p>
        </section>

        <div className="pt-2 border-t border-[var(--border)]/60">
          <Link
            href="/home"
            className="text-[var(--accent)] hover:text-[var(--accent-hover)] font-medium"
          >
            Back to home
          </Link>
        </div>
      </GlassCard>
    </div>
  );
}

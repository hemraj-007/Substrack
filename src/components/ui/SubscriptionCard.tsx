import Link from "next/link";
import { formatInr } from "@/lib/currency";
import { getMerchantBrand } from "@/lib/merchantLogos";
import { StatusBadge } from "./StatusBadge";

export type SubscriptionCardData = {
  id: string;
  merchant: string;
  amount: number;
  frequency?: string;
  status?: string;
  nextCharge?: string | null;
  cardLast4?: string | null;
};

export function SubscriptionCard({ sub }: { sub: SubscriptionCardData }) {
  const brand = getMerchantBrand(sub.merchant);
  const status = (sub.status ?? "ACTIVE").toUpperCase();
  const statusVariant =
    status === "AT_RISK" ? "at_risk" : status === "CANCELED" ? "canceled" : "active";

  const nextDate = sub.nextCharge
    ? new Date(sub.nextCharge).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
      })
    : "—";

  return (
    <Link
      href={`/dashboard/subscriptions/${sub.id}`}
      className="content-card p-4 sm:p-5 block hover:shadow-md transition-shadow group"
    >
      <div className="flex items-start justify-between gap-3">
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center text-sm font-bold shrink-0"
          style={{ backgroundColor: brand.bg, color: brand.color }}
        >
          {brand.initial}
        </div>
        <StatusBadge variant={statusVariant} />
      </div>
      <h3 className="mt-3 font-semibold text-[var(--foreground)] group-hover:text-[var(--accent)] transition-colors">
        {sub.merchant}
      </h3>
      <p className="text-lg font-bold text-[var(--foreground)] mt-1">
        {formatInr(sub.amount)}
        <span className="text-sm font-normal text-[var(--muted)]">
          /{(sub.frequency ?? "monthly").toLowerCase()}
        </span>
      </p>
      <p className="text-xs text-[var(--muted)] mt-2">
        Renews {nextDate}
        {sub.cardLast4 ? ` · •••• ${sub.cardLast4}` : ""}
      </p>
    </Link>
  );
}

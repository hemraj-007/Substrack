import type { Card } from "@/lib/api";
import { formatInr } from "@/lib/currency";

const CARD_STYLES = [
  {
    gradient: "linear-gradient(135deg, #5B5CEB 0%, #6366f1 45%, #3b82f6 100%)",
    badge: "Primary",
    badgeClass: "bg-white/25 text-white",
  },
  {
    gradient: "linear-gradient(145deg, #374151 0%, #1f2937 50%, #030712 100%)",
    badge: "Debit",
    badgeClass: "bg-white/15 text-white/90",
    pattern: true,
  },
  {
    gradient: "linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)",
    badge: "Credit",
    badgeClass: "bg-white/20 text-white",
  },
  {
    gradient: "linear-gradient(135deg, #0ea5e9 0%, #2563eb 100%)",
    badge: "Credit",
    badgeClass: "bg-white/20 text-white",
  },
];

type Props = {
  card: Card;
  index: number;
  subscriptionCount: number;
  monthlySpend: number;
  selected?: boolean;
  onClick?: () => void;
};

export function VisualCreditCard({
  card,
  index,
  subscriptionCount,
  monthlySpend,
  selected,
  onClick,
}: Props) {
  const style = CARD_STYLES[index % CARD_STYLES.length]!;
  const network = (card.network ?? "VISA").toUpperCase();
  const isMastercard = network.includes("MASTER");

  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative w-full text-left rounded-3xl p-6 min-h-[200px] flex flex-col justify-between overflow-hidden transition-all duration-300 ${
        selected
          ? "ring-2 ring-[#5B5CEB] ring-offset-2 ring-offset-[#FCFCFF] scale-[1.01] shadow-[0_20px_50px_rgba(91,92,235,0.25)]"
          : "shadow-[0_16px_40px_rgba(0,0,0,0.18)] hover:scale-[1.01] hover:shadow-[0_20px_48px_rgba(91,92,235,0.2)]"
      }`}
      style={{ background: style.gradient }}
    >
      {style.pattern && (
        <div
          className="absolute inset-0 opacity-30 pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 80%, rgba(255,255,255,0.08) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.06) 0%, transparent 40%)",
          }}
        />
      )}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_90%_10%,rgba(255,255,255,0.15),transparent_50%)] pointer-events-none" />

      <div className="relative flex items-start justify-between">
        {isMastercard ? (
          <div className="flex -space-x-2" aria-hidden>
            <span className="w-7 h-7 rounded-full bg-red-500/90" />
            <span className="w-7 h-7 rounded-full bg-amber-400/90" />
          </div>
        ) : (
          <span className="text-sm font-bold tracking-widest text-white/95">{network}</span>
        )}
        <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${style.badgeClass}`}>
          {style.badge}
        </span>
      </div>

      <div className="relative mt-8">
        <p className="text-xl font-mono tracking-[0.2em] text-white font-medium">
          •••• {card.last4}
        </p>
        <p className="text-sm text-white/75 mt-1.5">{card.bankName || "Bank Card"}</p>
      </div>

      <div className="relative flex items-end justify-between mt-6 pt-4 border-t border-white/15">
        <div>
          <p className="text-xs text-white/70">{subscriptionCount} Subscriptions</p>
        </div>
        <p className="text-lg font-bold text-white">
          {formatInr(monthlySpend)}
          <span className="text-sm font-normal text-white/70"> / month</span>
        </p>
      </div>
    </button>
  );
}

"use client";

import type { Card } from "@/lib/api";

type CardItemProps = {
  card: Card;
  onDelete?: (id: string) => void;
  deleting?: boolean;
};

export function CardItem({ card, onDelete, deleting }: CardItemProps) {
  return (
    <div className="glass-card row-glass rounded-xl sm:rounded-2xl backdrop-blur-xl p-3 sm:p-4 flex flex-wrap items-center justify-between gap-3">
      <div className="min-w-0 flex-1">
        <p className="font-mono font-semibold tracking-wider text-[var(--foreground)]">•••• {card.last4}</p>
        <p className="text-xs sm:text-sm text-[var(--muted)] truncate">
          {[card.bankName, card.network].filter(Boolean).join(" · ") || "—"}
        </p>
      </div>
      {onDelete && (
        <button
          type="button"
          onClick={() => onDelete(card.id)}
          disabled={deleting}
          className="rounded-lg border border-[var(--danger)]/30 bg-[var(--danger-subtle)] px-3 py-2 min-h-[44px] text-xs font-semibold text-[var(--danger)] hover:bg-[var(--danger)]/15 disabled:opacity-50 touch-manipulation"
        >
          {deleting ? "…" : "Remove"}
        </button>
      )}
    </div>
  );
}

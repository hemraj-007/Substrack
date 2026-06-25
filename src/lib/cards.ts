import type { Card } from "./api";

export function formatCardLabel(card: Pick<Card, "last4" | "bankName" | "network">): string {
  const meta = [card.bankName, card.network].filter(Boolean).join(" · ");
  return meta ? `•••• ${card.last4} (${meta})` : `•••• ${card.last4}`;
}

export function formatCardShort(card: Pick<Card, "last4">): string {
  return `•••• ${card.last4}`;
}

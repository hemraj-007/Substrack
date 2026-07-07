"use client";

import { useFetch } from "@/hooks/useFetch";
import { useCardFilterActions, useSelectedCardIds } from "@/hooks/useCardFilter";
import { cardsApi, type Card } from "@/lib/api";
import { formatCardShort } from "@/lib/cards";

function isCardActive(cardId: string, selected: string[] | null): boolean {
  if (selected === null) return false;
  return selected.includes(cardId);
}

function allCardsActive(selected: string[] | null): boolean {
  return selected === null;
}

export function CardFilter() {
  const { data } = useFetch(() => cardsApi.list().then((r) => r.data), {
    deps: [],
  });
  const cards = data ?? [];
  const selectedCardIds = useSelectedCardIds();
  const { selectAllCards, toggleCardSelection } = useCardFilterActions();

  if (cards.length === 0) return null;

  const selectionLabel =
    selectedCardIds === null
      ? "All cards"
      : selectedCardIds.length === 1
        ? formatCardShort(cards.find((c) => c.id === selectedCardIds[0]) ?? { last4: "????" })
        : `${selectedCardIds.length} cards`;

  return (
    <div className="mb-4 rounded-2xl border border-[#ECECF6] bg-white/70 backdrop-blur-sm px-4 py-3 shadow-[0_10px_40px_rgba(91,92,235,0.06)]">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">
          Filter by card
        </p>
        <p className="text-xs text-[var(--muted)]">Showing: {selectionLabel}</p>
      </div>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={selectAllCards}
          className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
            allCardsActive(selectedCardIds) ? "pill-active" : "pill-inactive"
          }`}
        >
          All cards
        </button>
        {cards.map((card: Card) => (
          <button
            key={card.id}
            type="button"
            onClick={() => toggleCardSelection(card.id)}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
              isCardActive(card.id, selectedCardIds) ? "pill-active" : "pill-inactive"
            }`}
          >
            {formatCardShort(card)}
          </button>
        ))}
      </div>
      <p className="text-xs text-[var(--muted)] mt-2">
        Tap one card to focus, or tap several to compare. Tap &quot;All cards&quot; to reset.
      </p>
    </div>
  );
}

"use client";

import { useMemo } from "react";
import { useUIStore } from "@/store/ui.store";

export function useSelectedCardIds() {
  return useUIStore((s) => s.selectedCardIds);
}

export function useCardFilterActions() {
  const selectAllCards = useUIStore((s) => s.selectAllCards);
  const toggleCardSelection = useUIStore((s) => s.toggleCardSelection);
  return { selectAllCards, toggleCardSelection };
}

/** Axios query params for subscription APIs (`cardIds=id1,id2`). */
export function useCardFilterParams(): { cardIds?: string } | undefined {
  const selectedCardIds = useSelectedCardIds();
  return useMemo(() => {
    if (!selectedCardIds?.length) return undefined;
    return { cardIds: selectedCardIds.join(",") };
  }, [selectedCardIds]);
}

export function useCardFilterQueryKey(): string {
  const selectedCardIds = useSelectedCardIds();
  return selectedCardIds?.length ? selectedCardIds.slice().sort().join(",") : "all";
}

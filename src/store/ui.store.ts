import { create } from "zustand";

/** `null` = all cards; non-empty array = only those card IDs. */
type UIState = {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean | ((prev: boolean) => boolean)) => void;
  toggleSidebar: () => void;
  selectedCardIds: string[] | null;
  selectAllCards: () => void;
  toggleCardSelection: (cardId: string) => void;
};

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: true,

  setSidebarOpen: (open) =>
    set((s) => ({
      sidebarOpen: typeof open === "function" ? open(s.sidebarOpen) : open,
    })),

  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),

  selectedCardIds: null,

  selectAllCards: () => set({ selectedCardIds: null }),

  toggleCardSelection: (cardId) =>
    set((s) => {
      const current = s.selectedCardIds;
      if (current === null) {
        return { selectedCardIds: [cardId] };
      }
      if (current.includes(cardId)) {
        const next = current.filter((id) => id !== cardId);
        return { selectedCardIds: next.length === 0 ? null : next };
      }
      return { selectedCardIds: [...current, cardId] };
    }),
}));

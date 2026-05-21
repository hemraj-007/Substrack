import { create } from "zustand";

type UIState = {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean | ((prev: boolean) => boolean)) => void;
  toggleSidebar: () => void;
};

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: true,

  setSidebarOpen: (open) =>
    set((s) => ({
      sidebarOpen: typeof open === "function" ? open(s.sidebarOpen) : open,
    })),

  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
}));

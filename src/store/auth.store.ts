import { create } from "zustand";
import type { User } from "@/lib/auth";
import {
  getToken,
  getUser,
  setToken as persistToken,
  setUser as persistUser,
  clearAuth as clearAuthStorage,
} from "@/lib/auth";

type AuthState = {
  user: User | null;
  token: string | null;
  hydrated: boolean;
  setAuth: (user: User, token: string) => void;
  clearAuth: () => void;
  hydrate: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  hydrated: false,

  setAuth: (user, token) => {
    if (typeof window !== "undefined") {
      persistToken(token);
      persistUser(user);
    }
    set({ user, token });
  },

  clearAuth: () => {
    if (typeof window !== "undefined") {
      clearAuthStorage();
    }
    set({ user: null, token: null });
  },

  hydrate: () => {
    const token = getToken();
    const user = getUser();
    set({ user, token, hydrated: true });
  },
}));

export const getIsAuthenticated = () => !!useAuthStore.getState().token;

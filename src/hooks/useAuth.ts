"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { User } from "@/lib/auth";
import {
  getToken,
  getUser,
  setToken,
  setUser,
  clearAuth,
} from "@/lib/auth";
import { authApi } from "@/lib/api";

export function useAuth() {
  const router = useRouter();
  const [user, setUserState] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const loadUser = useCallback(() => {
    const u = getUser();
    setUserState(u);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  useEffect(() => {
    const handleLogout = () => {
      clearAuth();
      setUserState(null);
      router.push("/login");
    };
    window.addEventListener("auth:logout", handleLogout);
    return () => window.removeEventListener("auth:logout", handleLogout);
  }, [router]);

  const login = useCallback(
    async (email: string, password: string) => {
      const { data } = await authApi.login(email, password);
      setToken(data.token);
      setUser(data.user);
      setUserState(data.user);
      router.push("/home");
    },
    [router]
  );

  const signup = useCallback(
    async (email: string, password: string) => {
      const { data } = await authApi.signup(email, password);
      setToken(data.token);
      setUser(data.user);
      setUserState(data.user);
      router.push("/home");
    },
    [router]
  );

  const logout = useCallback(() => {
    clearAuth();
    setUserState(null);
    router.push("/login");
  }, [router]);

  const isAuthenticated = !!getToken();

  return {
    user,
    loading,
    isAuthenticated,
    login,
    signup,
    logout,
    refreshUser: loadUser,
  };
}

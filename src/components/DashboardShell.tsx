"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Sidebar } from "@/components/Sidebar";
import { Navbar } from "@/components/Navbar";
import { BottomNav } from "@/components/BottomNav";

export function DashboardShell({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!isAuthenticated) {
      router.replace("/login");
    }
  }, [isAuthenticated, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-[var(--muted)]">Loading…</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="dashboard-theme h-screen md:h-dvh overflow-hidden flex relative">
      <div
        className="pointer-events-none absolute inset-0 opacity-70"
        aria-hidden
      >
        <div className="absolute inset-0 soft-grid" />
      </div>
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 relative z-[1] overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-y-auto px-4 py-4 pb-24 md:pb-6 md:py-6 md:px-6 lg:px-8">
          {children}
        </main>
      </div>
      <BottomNav />
    </div>
  );
}

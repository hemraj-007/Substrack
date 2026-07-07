"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Sidebar } from "@/components/Sidebar";
import { BottomNav } from "@/components/BottomNav";
import { LoadingState } from "@/components/Loader";

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
    return <LoadingState fullScreen title="Loading workspace" />;
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="dashboard-theme h-screen lg:h-dvh overflow-hidden flex relative">
      <div className="dash-bg-blob dash-bg-blob-1" aria-hidden />
      <div className="dash-bg-blob dash-bg-blob-2" aria-hidden />
      <div className="dash-bg-blob dash-bg-blob-3" aria-hidden />

      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 relative z-[1] overflow-hidden">
        <main className="flex-1 overflow-y-auto px-4 pb-24 lg:pb-8 lg:px-8 pt-4 lg:pt-6">
          <div className="max-w-[1440px] w-full mx-auto py-2 lg:py-4">{children}</div>
        </main>
      </div>
      <BottomNav />
    </div>
  );
}

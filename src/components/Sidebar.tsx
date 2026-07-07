"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { MAIN_NAV, isNavActive } from "@/lib/nav";
import { NavIcons } from "@/lib/navIcons";

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuth();

  function handleLogout() {
    logout();
    router.replace("/login");
  }

  return (
    <aside className="hidden lg:flex w-[260px] shrink-0 p-4 h-screen sticky top-0">
      <div className="dash-sidebar flex flex-col w-full h-full rounded-3xl overflow-hidden">
        <div className="shrink-0 px-5 pt-5 pb-3">
          <Link href="/dashboard" className="flex items-center gap-2.5">
            <span className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-[#5B5CEB] to-[#8B5CF6] font-bold text-white text-sm shadow-md shadow-indigo-500/20">
              S
            </span>
            <span className="font-bold text-slate-900 text-lg tracking-tight">SubTrack</span>
          </Link>
        </div>

        <nav className="flex-1 px-3 py-2 space-y-0.5 overflow-hidden">
          {MAIN_NAV.map(({ href, label, icon }) => {
            const active = isNavActive(pathname ?? "", href);
            const Icon = NavIcons[icon];
            return (
              <Link
                key={href}
                href={href}
                className={`dash-nav-item flex items-center gap-3 px-3 h-10 rounded-xl text-sm font-medium transition-all duration-200 ${
                  active ? "dash-nav-item-active" : "text-slate-500 hover:bg-violet-50 hover:text-slate-900"
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="shrink-0 p-3 pt-4 mt-1 border-t border-[#ECECF6] space-y-2">
          <div className="dash-pro-card rounded-2xl p-3.5 text-white">
            <p className="text-sm font-semibold">Upgrade to Pro</p>
            <p className="text-xs text-white/80 mt-0.5 leading-snug">
              Unlock AI insights and priority alerts.
            </p>
            <Link
              href="/dashboard/settings"
              className="mt-2 inline-block rounded-xl bg-white/20 hover:bg-white/30 backdrop-blur-sm px-3 py-1 text-xs font-semibold text-white transition"
            >
              Learn more
            </Link>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="w-full text-left px-3 py-1.5 text-sm text-slate-500 hover:text-red-500 transition"
          >
            Log out
          </button>
        </div>
      </div>
    </aside>
  );
}

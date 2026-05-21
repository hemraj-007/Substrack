"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

const nav = [
  { href: "/home", label: "Home", icon: HomeIcon },
  { href: "/dashboard", label: "Dashboard", icon: DashboardGridIcon },
  { href: "/dashboard/cards", label: "Cards", icon: WalletIcon },
  { href: "/dashboard/upload", label: "Upload", icon: UploadIcon },
  { href: "/dashboard/transactions", label: "Transactions", icon: ReceiptIcon },
  { href: "/dashboard/subscriptions", label: "Subscriptions", icon: ListIcon },
  { href: "/dashboard/alerts", label: "Alerts", icon: BellIcon },
];

function HomeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  );
}

function DashboardGridIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zM14 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z"
      />
    </svg>
  );
}

function WalletIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
    </svg>
  );
}

function UploadIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
    </svg>
  );
}

function ListIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
    </svg>
  );
}

function ReceiptIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
    </svg>
  );
}

function BellIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
    </svg>
  );
}

function LogoutIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
    </svg>
  );
}

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuth();

  function handleLogout() {
    logout();
    router.replace("/login");
  }

  return (
    <aside className="hidden md:flex w-[84px] shrink-0 flex-col sticky top-0 h-screen md:h-dvh">
      <div className="px-3 py-4 flex justify-center">
        <Link
          href="/home"
          className="flex items-center justify-center w-11 h-11 rounded-2xl bg-gradient-to-br from-[var(--accent)] to-[var(--accent-2)] font-bold text-lg text-white shadow-[0_14px_24px_rgba(76,132,255,0.35)]"
          title="Subscription Guardian"
        >
          <span className="text-white">S</span>
        </Link>
      </div>
      <nav className="flex-1 p-3 flex flex-col items-center gap-2">
        {nav.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              title={label}
              className={`group flex items-center justify-center w-12 h-12 rounded-2xl border transition duration-200 ${
                active
                  ? "border-transparent bg-gradient-to-br from-[var(--accent)] to-[var(--accent-2)] text-white shadow-[0_12px_24px_rgba(76,132,255,0.36)]"
                  : "border-[var(--border)] bg-[var(--glass)] text-[var(--muted)] hover:text-[var(--foreground)] hover:border-[var(--glass-hover-border)] hover:bg-[var(--glass-hover)]"
              }`}
            >
              <Icon className={`w-5 h-5 shrink-0 transition group-hover:scale-105 ${active ? "text-white" : ""}`} />
            </Link>
          );
        })}
      </nav>
      <div className="p-3">
        <button
          type="button"
          onClick={handleLogout}
          title="Log out"
          className="flex items-center justify-center w-12 h-12 rounded-2xl border border-[var(--border)] bg-[var(--glass)] text-[var(--muted)] hover:text-[var(--foreground)] hover:border-red-300/50 hover:bg-[var(--danger-subtle)] transition mx-auto"
        >
          <LogoutIcon className="w-5 h-5" />
        </button>
      </div>
    </aside>
  );
}
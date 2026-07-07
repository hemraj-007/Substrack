"use client";

import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { createPortal } from "react-dom";

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  );
}

function BellIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
    </svg>
  );
}

export function Navbar() {
  const { user, logout } = useAuth();
  const displayName = user?.email?.split("@")[0] ?? "User";
  const initials = displayName.slice(0, 2).toUpperCase();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const qParam = searchParams.get("q") ?? "";
  const [localValue, setLocalValue] = useState(qParam);
  const [profileOpen, setProfileOpen] = useState(false);
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setLocalValue(qParam);
  }, [qParam]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    }
    if (profileOpen) {
      document.addEventListener("click", handleClickOutside);
      return () => document.removeEventListener("click", handleClickOutside);
    }
  }, [profileOpen]);

  function updateSearchQuery(value: string) {
    const next = new URLSearchParams(searchParams.toString());
    const trimmed = value.trim();
    if (trimmed) next.set("q", trimmed);
    else next.delete("q");
    const query = next.toString();
    router.replace(query ? `${pathname}?${query}` : pathname);
  }

  function handleSearchChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    setLocalValue(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => updateSearchQuery(value), 300);
  }

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
      debounceRef.current = null;
    }
    updateSearchQuery(localValue);
  }

  return (
    <header className="sticky top-0 z-20 px-4 lg:px-8 pt-4 pb-2">
      <div className="dash-topbar flex items-center gap-4 h-12 lg:h-[52px] px-4 lg:px-5 rounded-2xl">
        <Link href="/dashboard" className="lg:hidden flex items-center gap-2 shrink-0">
          <span className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#5B5CEB] to-[#8B5CF6] text-white font-bold text-xs flex items-center justify-center">
            S
          </span>
        </Link>

        <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-xl hidden sm:block">
          <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="search"
            placeholder="Search subscriptions, merchants..."
            value={localValue}
            onChange={handleSearchChange}
            className="dash-search w-full h-12 pl-11 pr-4 text-sm text-slate-700 placeholder:text-slate-400"
            aria-label="Search"
          />
        </form>

        <div className="flex-1 sm:hidden" />

        <div className="flex items-center gap-2 sm:gap-3 shrink-0 relative" ref={dropdownRef}>
          <Link
            href="/dashboard/alerts"
            className="w-10 h-10 rounded-xl border border-[#ECECF6] bg-white/80 flex items-center justify-center text-slate-500 hover:bg-violet-50 hover:text-[#5B5CEB] transition"
            aria-label="Notifications"
          >
            <BellIcon className="w-5 h-5" />
          </Link>

          <button
            type="button"
            onClick={() => setProfileOpen((o) => !o)}
            className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#5B5CEB] to-[#8B5CF6] text-white flex items-center justify-center text-xs font-semibold shadow-sm hover:scale-[1.03] transition-transform"
            aria-expanded={profileOpen}
            aria-label="Profile menu"
          >
            {initials}
          </button>

          {profileOpen && (
            <div className="absolute right-0 top-full mt-2 w-52 rounded-2xl border border-[#ECECF6] bg-white shadow-[0_10px_40px_rgba(91,92,235,0.12)] py-2 z-50">
              <div className="px-4 py-2 border-b border-[#ECECF6]">
                <p className="text-xs text-slate-400 truncate">{user?.email}</p>
                <p className="text-sm font-semibold text-slate-900 capitalize">{displayName}</p>
              </div>
              <Link href="/dashboard/profile" className="block px-4 py-2.5 text-sm text-slate-700 hover:bg-violet-50" onClick={() => setProfileOpen(false)}>
                Account
              </Link>
              <Link href="/dashboard/settings" className="block px-4 py-2.5 text-sm text-slate-700 hover:bg-violet-50" onClick={() => setProfileOpen(false)}>
                Settings
              </Link>
              <button
                type="button"
                onClick={() => {
                  setProfileOpen(false);
                  setLogoutModalOpen(true);
                }}
                className="w-full text-left px-4 py-2.5 text-sm text-red-500 hover:bg-red-50"
              >
                Log out
              </button>
            </div>
          )}
        </div>
      </div>

      {logoutModalOpen &&
        typeof document !== "undefined" &&
        createPortal(
          <>
            <div className="fixed inset-0 z-[100] bg-black/30 backdrop-blur-sm" onClick={() => setLogoutModalOpen(false)} />
            <div className="fixed inset-0 z-[101] flex items-center justify-center p-4 pointer-events-none">
              <div className="dash-card w-full max-w-sm p-6 pointer-events-auto">
                <h2 className="text-lg font-semibold text-slate-900">Log out?</h2>
                <p className="mt-1 text-sm text-slate-500">You will need to sign in again.</p>
                <div className="mt-5 flex gap-3 justify-end">
                  <button type="button" onClick={() => setLogoutModalOpen(false)} className="dash-btn-secondary px-4 py-2 text-sm">
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setLogoutModalOpen(false);
                      logout();
                      router.replace("/login");
                    }}
                    className="rounded-xl bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600"
                  >
                    Log out
                  </button>
                </div>
              </div>
            </div>
          </>,
          document.body
        )}
    </header>
  );
}

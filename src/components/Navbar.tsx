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

function UserIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  );
}

function CogIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}

function DocumentIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  );
}

function QuestionIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
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

  function openLogoutModal() {
    setProfileOpen(false);
    setLogoutModalOpen(true);
  }

  function confirmLogout() {
    setLogoutModalOpen(false);
    logout();
    router.replace("/login");
  }

  return (
    <header className="sticky top-0 z-10 bg-[var(--background)]/80 backdrop-blur-md border-b border-[var(--border)]/50 md:border-b-0">
      <div className="px-3 py-2.5 sm:px-4 sm:py-3 md:px-6 flex items-center justify-between gap-2 sm:gap-4 min-h-12 md:min-h-0">
        <Link
          href="/home"
          className="flex items-center gap-2 sm:gap-3 shrink-0 min-w-0"
        >
          <span className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-[var(--accent)] to-[var(--accent-2)] font-bold text-sm sm:text-base text-white shrink-0">
            S
          </span>
          <span className="font-semibold tracking-wide text-[var(--foreground)] truncate hidden sm:inline text-sm md:text-base">
            Subscription Guardian
          </span>
        </Link>

        {pathname !== "/home" && (
          <div className="flex-1 max-w-md mx-2 md:mx-4 hidden md:block min-w-0">
            <form onSubmit={handleSearchSubmit} className="relative">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted)]" />
              <input
                type="search"
                placeholder="Search payments..."
                value={localValue}
                onChange={handleSearchChange}
                className="surface-input w-full py-2.5 pl-10 pr-4 text-sm placeholder:text-[var(--muted)]"
                aria-label="Search payments"
              />
            </form>
          </div>
        )}

        <div className="flex items-center gap-2 sm:gap-3 shrink-0 relative" ref={dropdownRef}>
          <span className="text-xs sm:text-sm text-[var(--foreground)]/90 hidden sm:inline truncate max-w-[100px] md:max-w-none">
            Hi {displayName}!
          </span>
          <button
            type="button"
            onClick={() => setProfileOpen((o) => !o)}
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-[var(--glass-border)] bg-[var(--accent-subtle)] text-[var(--accent-hover)] flex items-center justify-center text-xs sm:text-sm font-semibold shrink-0 hover:ring-2 hover:ring-[var(--accent)]/30 focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition touch-manipulation"
            aria-expanded={profileOpen}
            aria-haspopup="true"
            aria-label="Open profile menu"
          >
            {initials}
          </button>

          {profileOpen && (
            <div
              className="absolute right-0 top-full mt-2 w-56 rounded-xl border border-[var(--glass-border)] bg-[var(--card)] shadow-lg shadow-black/10 backdrop-blur-xl py-1.5 z-50"
              role="menu"
              aria-orientation="vertical"
            >
              <div className="px-3 py-2.5 border-b border-[var(--border)]/50">
                <p className="text-xs text-[var(--muted)] truncate" title={user?.email ?? ""}>
                  {user?.email ?? "Signed in"}
                </p>
                <p className="text-sm font-medium text-[var(--foreground)] truncate mt-0.5">
                  {displayName}
                </p>
              </div>
              <div className="py-1">
                <Link
                  href="/dashboard/profile"
                  onClick={() => setProfileOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 text-sm text-[var(--foreground)] hover:bg-[var(--glass-hover)] transition"
                  role="menuitem"
                >
                  <UserIcon className="w-4 h-4 text-[var(--muted)] shrink-0" />
                  Account
                </Link>
                <Link
                  href="/dashboard/settings"
                  onClick={() => setProfileOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 text-sm text-[var(--foreground)] hover:bg-[var(--glass-hover)] transition"
                  role="menuitem"
                >
                  <CogIcon className="w-4 h-4 text-[var(--muted)] shrink-0" />
                  Settings
                </Link>
                <a
                  href="mailto:support@subscriptionguardian.example.com"
                  onClick={() => setProfileOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 text-sm text-[var(--foreground)] hover:bg-[var(--glass-hover)] transition"
                  role="menuitem"
                >
                  <QuestionIcon className="w-4 h-4 text-[var(--muted)] shrink-0" />
                  Help &amp; support
                </a>
                <a
                  href="/privacy"
                  onClick={() => setProfileOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 text-sm text-[var(--foreground)] hover:bg-[var(--glass-hover)] transition"
                  role="menuitem"
                >
                  <DocumentIcon className="w-4 h-4 text-[var(--muted)] shrink-0" />
                  Privacy policy
                </a>
              </div>
              <div className="border-t border-[var(--border)]/50 pt-1">
                <button
                  type="button"
                  onClick={openLogoutModal}
                  className="flex w-full items-center gap-2.5 px-3 py-2 text-sm text-[var(--danger)] hover:bg-[var(--danger-subtle)] transition"
                  role="menuitem"
                >
                  <LogoutIcon className="w-4 h-4 shrink-0" />
                  Log out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Log out confirmation modal: portaled to body so it's always viewport-centered */}
      {logoutModalOpen &&
        typeof document !== "undefined" &&
        createPortal(
          <>      
            {/* Overlay (behind) */}
            <div
              className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm"
              aria-hidden
              onClick={() => setLogoutModalOpen(false)}
            />
            {/* Centered modal (on top of overlay) */}
            <div
              className="fixed inset-0 z-[101] flex items-center justify-center p-4 pointer-events-none"
              aria-modal="true"
              role="dialog"
              aria-labelledby="logout-modal-title"
            >
              <div
                className="w-full max-w-sm rounded-xl border border-[var(--glass-border)] bg-[var(--card)] shadow-xl p-5 pointer-events-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <h2 id="logout-modal-title" className="text-lg font-semibold text-[var(--foreground)]">
                  Log out?
                </h2>
                <p className="mt-1 text-sm text-[var(--muted)]">
                  You will need to sign in again to access your account.
                </p>
                <div className="mt-5 flex gap-3 justify-end">
                  <button
                    type="button"
                    onClick={() => setLogoutModalOpen(false)}
                    className="rounded-lg border border-[var(--border)] bg-[var(--glass)] px-4 py-2 text-sm font-medium text-[var(--foreground)] hover:bg-[var(--glass-hover)] transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={confirmLogout}
                    className="rounded-lg bg-[var(--danger)] px-4 py-2 text-sm font-medium text-white hover:opacity-90 transition"
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

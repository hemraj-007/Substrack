"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MOBILE_NAV, isNavActive } from "@/lib/nav";

export function BottomNav() {
  const pathname = usePathname();

  if (!pathname?.startsWith("/dashboard")) return null;

  return (
    <nav
      className="lg:hidden fixed bottom-0 left-0 right-0 z-20 bg-[var(--card)] border-t border-[var(--border)] pb-[env(safe-area-inset-bottom)] shadow-[0_-4px_12px_rgba(0,0,0,0.04)]"
      aria-label="Main navigation"
    >
      <div className="flex items-stretch justify-around max-w-lg mx-auto">
        {MOBILE_NAV.map(({ href, label }) => {
          const active = isNavActive(pathname ?? "", href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center justify-center flex-1 min-h-[52px] py-1 text-[10px] font-medium transition ${
                active ? "text-[var(--accent)]" : "text-[var(--muted)]"
              }`}
              aria-current={active ? "page" : undefined}
            >
              <span className="truncate px-1">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

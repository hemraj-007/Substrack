import Link from "next/link";

export function LandingFooter() {
  return (
    <footer id="about" className="border-t border-[var(--border)] bg-white py-10">
      {/* <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 text-white font-bold flex items-center justify-center text-xs">
            S
          </span>
          <span className="font-bold text-[var(--foreground)]">SubTrack</span>
        </div>
        <p className="text-xs text-[var(--muted)]">
          © {new Date().getFullYear()} SubTrack. All rights reserved.
        </p>
        <div className="flex gap-4 text-sm">
          <Link href="/privacy" className="text-[var(--muted)] hover:text-[var(--foreground)]">
            Privacy
          </Link>
          <Link href="/login" className="text-[var(--muted)] hover:text-[var(--foreground)]">
            Log in
          </Link>
        </div>
      </div> */}
    </footer>
  );
}

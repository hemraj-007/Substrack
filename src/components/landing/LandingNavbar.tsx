import Link from "next/link";

const NAV_LINKS = [
  { label: "Features", href: "#features" },
  { label: "How it works", href: "#how-it-works" },
  { label: "Pricing", href: "#pricing" },
  // { label: "Blog", href: "#blog" },
  // { label: "About", href: "#about" },
];

export function LandingNavbar() {
  return (
    <header className="sticky top-0 z-50 px-4 sm:px-6 pt-3 sm:pt-4 safe-area-inset">
      <div className="max-w-6xl mx-auto h-14 sm:h-16 flex items-center justify-between gap-4 px-5 sm:px-6 rounded-2xl bg-white/70 backdrop-blur-xl border border-white/60 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.06)]">
          <Link href="/" className="flex items-center gap-2.5 shrink-0">
            <span className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white font-bold flex items-center justify-center text-sm shadow-md shadow-indigo-500/25">
              S
            </span>
            <span className="font-bold text-lg text-slate-900 tracking-tight">SubTrack</span>
          </Link>

          <nav className="hidden lg:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <Link
              href="/login"
              className="text-sm font-medium text-slate-600 hover:text-slate-900 px-3 py-2 rounded-xl hover:bg-slate-50 transition"
            >
              Log in
            </Link>
            <Link
              href="/login"
              className="landing-cta rounded-xl px-4 sm:px-5 py-2.5 text-sm font-semibold"
            >
              Get started free
            </Link>
          </div>
        </div>
    </header>
  );
}

import Link from "next/link";
import { HeroCards } from "@/components/HeroCards";

export default function LandingPage() {
  return (
    <main className="min-h-screen min-h-[100dvh] relative flex flex-col items-center justify-center px-4 py-12 sm:py-16 hero-gradient safe-area-inset">
      <HeroCards />
      <div className="relative z-10 flex flex-col items-center w-full max-w-2xl">
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-center mb-4 sm:mb-5 text-balance">
          Track cards, subscriptions &amp; renewals in one place
        </h1>
        <p className="text-base sm:text-lg md:text-xl text-[var(--muted)] text-center max-w-xl mb-8 sm:mb-10 leading-relaxed tracking-tight">
          Upload statements, detect recurring charges, and get renewal and unused subscription alerts.
        </p>
        <Link
          href="/login"
          className="rounded-xl glow-button px-6 sm:px-8 py-3 min-h-[48px] font-semibold text-base sm:text-lg text-white hover:opacity-95 transition touch-manipulation inline-flex items-center justify-center"
        >
          <span className="text-white">Get started</span>
        </Link>
      </div>
    </main>
  );
}

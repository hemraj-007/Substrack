import Link from "next/link";
import { LandingHeroMockup } from "./LandingHeroMockup";

export function LandingHero() {
  return (
    <section className="relative overflow-x-clip overflow-y-visible">
      <div className="absolute inset-0 landing-hero-glow pointer-events-none" aria-hidden />

      <div className="max-w-6xl mx-auto px-5 sm:px-8 pt-16 sm:pt-24 pb-8 sm:pb-10">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-20 items-center">
          <div className="relative z-10 text-center lg:text-left">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50/80 border border-indigo-100/80 px-4 py-1.5 text-xs font-semibold text-indigo-600 mb-8 backdrop-blur-sm">
              ✨ AI Powered
            </span>

            <h1 className="text-[2.5rem] sm:text-5xl lg:text-[3.5rem] font-bold tracking-tight leading-[1.08] text-slate-900">
              Track every subscription.
              <br />
              <span className="landing-gradient-text">Save more every month.</span>
            </h1>

            <p className="mt-6 text-base sm:text-lg text-slate-500 max-w-md mx-auto lg:mx-0 leading-relaxed font-normal">
              Upload your bank statements and let AI find recurring payments, renewals, and hidden
              charges. All in one beautiful dashboard.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Link
                href="/login"
                className="landing-cta w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl px-8 py-4 text-base font-semibold"
              >
                Get started for free
                <span aria-hidden>→</span>
              </Link>
              <a
                href="#how-it-works"
                className="landing-secondary-cta w-full sm:w-auto inline-flex items-center justify-center gap-3 rounded-2xl px-8 py-4 text-base font-semibold text-slate-700"
              >
                <span className="w-9 h-9 rounded-full bg-indigo-50 text-indigo-500 flex items-center justify-center text-xs shadow-inner">
                  ▶
                </span>
                See how it works
              </a>
            </div>
          </div>

          <div className="relative z-10 lg:pl-4 overflow-visible">
            <LandingHeroMockup />
          </div>
        </div>
      </div>
    </section>
  );
}

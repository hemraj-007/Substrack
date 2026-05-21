import Link from "next/link";
import { GlassCard } from "@/components/GlassCard";

export default function PostLoginHomePage() {
  return (
    <div className="w-full max-w-none space-y-10 pb-8">
      <GlassCard className="p-6 sm:p-8">
        <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-12">
          <div>
            <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-[var(--glass-border)] bg-[var(--accent-subtle)] px-3 py-1.5 text-xs font-semibold text-[var(--accent-hover)] sm:text-sm">
              <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              Trusted by thousands of subscribers
            </p>
            <h1 className="text-3xl font-extrabold leading-[1.12] tracking-tight text-[var(--foreground)] sm:text-4xl lg:text-[2.65rem]">
              Seamless credit{" "}
              <span className="relative inline-block">
                <span className="relative z-[1] px-0.5">solutions</span>
                <span
                  className="absolute inset-x-0 bottom-0 top-[0.42em] -z-0 rounded-md bg-gradient-to-r from-[var(--accent-subtle)] to-[var(--accent-subtle)] ring-1 ring-[var(--accent)]/25"
                  aria-hidden
                />
              </span>{" "}
              for your spending
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-[var(--muted)] sm:text-base">
              Track every card and recurring charge in one workspace. Upload statements, spot renewals
              early, and stay on top of unused subscriptions—without the spreadsheet chaos.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Link
                href="/dashboard"
                className="glow-button inline-flex min-h-[44px] items-center justify-center rounded-xl px-6 py-2.5 text-sm font-semibold text-white sm:text-base"
              >
                Go to dashboard
              </Link>
              <Link
                href="/dashboard/cards"
                className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--accent-hover)] underline-offset-4 hover:underline sm:text-base"
              >
                <svg className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                  />
                </svg>
                My cards
              </Link>
            </div>
            <ul className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {[
                "Flexible views across cards & merchants",
                "Your data stays yours—no surprise fees in-app",
                "Fast setup: upload CSV or paste transactions",
                "Renewal reminders before charges hit",
              ].map((text) => (
                <li key={text} className="flex items-start gap-2.5 text-sm font-medium text-[var(--foreground)]/90">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--accent-subtle)] text-[var(--accent)]">
                    <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                  {text}
                </li>
              ))}
            </ul>
            <p className="mt-6 text-xs text-[var(--muted)]">
              <span className="font-medium text-[var(--foreground)]/80">On this page:</span>{" "}
              <a href="#benefits" className="text-[var(--accent-hover)] hover:underline">
                Benefits
              </a>
              {" · "}
              <a href="#how" className="text-[var(--accent-hover)] hover:underline">
                How it works
              </a>
              {" · "}
              <a href="#faqs" className="text-[var(--accent-hover)] hover:underline">
                FAQs
              </a>
              {" · "}
              <a href="#contact" className="text-[var(--accent-hover)] hover:underline">
                Contact
              </a>
            </p>
          </div>

          <div className="relative min-h-[280px] lg:min-h-[360px]">
            <div
              className="absolute inset-0 rounded-3xl bg-gradient-to-br from-[var(--glass)] to-[var(--background)] ring-1 ring-[var(--border)]"
              aria-hidden
            />
            <div className="relative flex h-full min-h-[280px] items-center justify-center p-6 sm:p-8 lg:min-h-[360px]">
              <div className="relative w-full min-w-0">
                <div
                  className="absolute -right-1 top-6 z-[1] w-[88%] rotate-[-8deg] rounded-2xl border border-white/30 p-4 shadow-lg backdrop-blur-xl"
                  style={{
                    background:
                      "linear-gradient(145deg, rgba(99, 102, 241, 0.45), rgba(79, 70, 229, 0.55))",
                  }}
                >
                  <p className="text-xs font-medium text-white/90">Business</p>
                  <p className="mt-5 font-mono text-sm tracking-wider text-white/95">7812 2139 0823 ••••</p>
                  <div className="mt-3 flex justify-between text-xs text-white/75">
                    <span>Cardholder</span>
                    <span>05/24</span>
                  </div>
                </div>
                <div
                  className="absolute -left-3 top-20 z-[2] w-[88%] rotate-[6deg] rounded-2xl border border-white/40 p-4 shadow-xl backdrop-blur-xl"
                  style={{
                    background:
                      "linear-gradient(145deg, rgba(37, 99, 235, 0.35), rgba(99, 102, 241, 0.45))",
                  }}
                >
                  <p className="text-xs font-semibold text-white/95">Primary</p>
                  <p className="mt-5 font-mono text-sm tracking-wider text-white/95">4920 1834 9021 ••••</p>
                  <div className="mt-3 flex justify-between text-xs text-white/80">
                    <span>Cardholder</span>
                    <span>05/24</span>
                  </div>
                </div>
                <div className="relative z-[3] mt-4 w-full rounded-2xl border border-[var(--glass-border)] bg-[var(--glass-strong)]/90 p-5 shadow-xl backdrop-blur-2xl">
                  <div className="flex items-start justify-between">
                    <span className="text-xs font-medium text-[var(--muted)]">Subscription Guardian</span>
                    <span className="rounded-md bg-[var(--accent-subtle)] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[var(--accent)]">
                      Active
                    </span>
                  </div>
                  <p className="mt-6 font-mono text-base tracking-widest text-[var(--foreground)] sm:text-lg">
                    6011 9022 4410 ••••
                  </p>
                  <div className="mt-4 flex justify-between border-t border-[var(--border)] pt-3 text-xs text-[var(--muted)]">
                    <span>Cardholder</span>
                    <span>Valid 05/24</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </GlassCard>

      <section
        id="benefits"
        className="scroll-mt-28 rounded-2xl border border-[var(--border)] bg-gradient-to-br from-slate-800 via-slate-800 to-slate-900 px-6 py-10 text-white shadow-lg sm:px-10 sm:py-12"
      >
        <div className="grid gap-10 md:grid-cols-3 md:gap-8">
          <div>
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
            </div>
            <h2 className="text-lg font-bold">Bank-level security</h2>
            <p className="mt-2 text-sm leading-relaxed text-white/75">
              Your session is protected; uploads are processed for insights—only what you need to reconcile
              subscriptions and renewals.
            </p>
          </div>
          <div>
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                />
              </svg>
            </div>
            <h2 className="text-lg font-bold">Every charge, one ledger</h2>
            <p className="mt-2 text-sm leading-relaxed text-white/75">
              Import transactions and surface recurring merchants, trial endings, and price jumps
              instantly.
            </p>
          </div>
          <div>
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h2 className="text-lg font-bold">Works with your stack</h2>
            <p className="mt-2 text-sm leading-relaxed text-white/75">
              Use the dashboard on desktop or mobile—keep renewals aligned with how you already manage
              money.
            </p>
          </div>
        </div>
      </section>

      <section id="how" className="scroll-mt-28">
        <h2 className="text-center text-xl font-extrabold tracking-tight text-[var(--foreground)] sm:text-2xl">
          How it works
        </h2>
        <ol className="mt-8 grid w-full gap-4 sm:grid-cols-3 sm:gap-6">
          {[
            {
              step: "1",
              title: "Connect your activity",
              body: "Upload statements or add transactions so every charge lands in one place.",
            },
            {
              step: "2",
              title: "Spot recurring spend",
              body: "Surface subscriptions, trials, and price changes before they renew.",
            },
            {
              step: "3",
              title: "Act on your timeline",
              body: "Use alerts and the dashboard to cancel or renegotiate with confidence.",
            },
          ].map((item) => (
            <li key={item.step}>
              <GlassCard className="h-full p-5 text-center">
                <span className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-[var(--accent-subtle)] text-sm font-bold text-[var(--accent)]">
                  {item.step}
                </span>
                <h3 className="mt-3 text-sm font-bold text-[var(--foreground)] sm:text-base">{item.title}</h3>
                <p className="mt-2 text-xs leading-relaxed text-[var(--muted)] sm:text-sm">{item.body}</p>
              </GlassCard>
            </li>
          ))}
        </ol>
      </section>

      <section id="faqs" className="scroll-mt-28">
        <h2 className="text-center text-xl font-extrabold tracking-tight text-[var(--foreground)] sm:text-2xl">
          FAQs
        </h2>
        <dl className="mt-8 w-full space-y-4">
          {[
            {
              q: "Is my financial data stored on your servers?",
              a: "Sessions are authenticated; uploads are processed for insights—follow in-app guidance for what we retain.",
            },
            {
              q: "Can I use this without linking a bank?",
              a: "Yes. CSV uploads and manual review are supported so you stay in control.",
            },
            {
              q: "Where do I manage renewals?",
              a: "Use Alerts and Subscriptions from the dashboard.",
            },
          ].map((faq) => (
            <div key={faq.q}>
              <GlassCard className="p-4 sm:p-5">
                <dt className="font-semibold text-[var(--foreground)]">{faq.q}</dt>
                <dd className="mt-2 text-sm leading-relaxed text-[var(--muted)]">{faq.a}</dd>
              </GlassCard>
            </div>
          ))}
        </dl>
      </section>

      <section id="contact" className="scroll-mt-28 text-center">
        <GlassCard className="w-full p-6 sm:p-8">
          <p className="text-sm text-[var(--muted)]">
            Questions? From the dashboard, open{" "}
            <strong className="font-semibold text-[var(--foreground)]">Alerts</strong> and account settings when
            in-app support is available.
          </p>
          <Link
            href="/dashboard"
            className="glow-button mt-5 inline-flex min-h-[44px] w-full items-center justify-center rounded-xl px-6 py-2.5 text-sm font-semibold text-white sm:w-auto sm:text-base"
          >
            Continue to dashboard
          </Link>
        </GlassCard>
      </section>
    </div>
  );
}

"use client";

import { MerchantLogoIcon } from "./MerchantLogoIcon";

const SUBS = [
  { merchant: "Netflix", amount: 649 },
  { merchant: "Spotify", amount: 119 },
  { merchant: "Amazon Prime", amount: 149 },
  { merchant: "Figma", amount: 99 },
];

/** Four logos only — right side of the dashboard card, gentle vertical curve. */
const FLOATING = [
  { name: "Netflix", top: "0%", right: "2%", delay: "0s" },
  { name: "Spotify", top: "20%", right: "-10%", delay: "0.35s" },
  { name: "YouTube", top: "50%", right: "-8%", delay: "0.7s" },
  { name: "Amazon", top: "72%", right: "4%", delay: "1.05s" },
] as const;

const CHART_POINTS = "4,52 28,44 52,48 76,32 100,36 124,20 148,24";

export function LandingHeroMockup() {
  return (
    <div className="landing-hero-visual-wrap relative w-full min-h-[440px] sm:min-h-[500px] flex items-center justify-center overflow-visible">
      <div className="landing-hero-mixed-bg pointer-events-none" aria-hidden />

      {/* Dotted arrow — right of card, above card bg, below merchant tiles */}
      <svg
        className="landing-hero-arrow absolute pointer-events-none"
        viewBox="0 0 160 420"
        fill="none"
        aria-hidden
      >
        <defs>
          <marker
            id="landingArrowHead"
            markerWidth="8"
            markerHeight="8"
            refX="6"
            refY="4"
            orient="auto"
          >
            <path d="M0,0 L8,4 L0,8 Z" fill="#ec4899" />
          </marker>
        </defs>
        <path
          d="M 12 95
             C 45 75, 78 55, 108 48
             C 132 42, 148 68, 142 105
             C 136 148, 108 185, 88 230
             C 72 268, 68 310, 82 355
             C 92 385, 108 400, 118 410"
          stroke="#ec4899"
          strokeWidth="2.5"
          strokeDasharray="7 8"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          markerEnd="url(#landingArrowHead)"
        />
      </svg>

      {FLOATING.map(({ name, top, right, delay }) => (
        <div
          key={name}
          className="landing-merchant-tile absolute z-30"
          style={{ top, right, animationDelay: delay }}
        >
          <MerchantLogoIcon merchant={name} size={30} />
        </div>
      ))}

      <div
        className="landing-dashboard-card relative z-20 w-full max-w-[340px] rounded-[28px] bg-white/95 backdrop-blur-xl p-6 sm:p-7 border border-white shadow-[0_24px_48px_-12px_rgba(99,102,241,0.15)]"
        style={{ transform: "rotate(8deg)" }}
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs text-slate-500 font-medium tracking-wide">Monthly spend</p>
            <p className="text-3xl sm:text-4xl font-bold text-slate-900 mt-1 tracking-tight">
              ₹4,650
            </p>
          </div>
          <span className="rounded-full bg-emerald-50 text-emerald-600 text-[11px] font-semibold px-3 py-1.5 border border-emerald-100 whitespace-nowrap">
            ↑ 12% vs last month
          </span>
        </div>

        <div className="mt-6 h-32">
          <svg viewBox="0 0 152 64" className="w-full h-full" preserveAspectRatio="none" aria-hidden>
            <defs>
              <linearGradient id="heroChartFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#818cf8" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#818cf8" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="heroLineGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#6366f1" />
                <stop offset="100%" stopColor="#a78bfa" />
              </linearGradient>
            </defs>
            <polyline points={`${CHART_POINTS} 148,64 4,64`} fill="url(#heroChartFill)" stroke="none" />
            <polyline
              points={CHART_POINTS}
              fill="none"
              stroke="url(#heroLineGrad)"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <div className="flex justify-between text-[10px] text-slate-400 mt-2 px-0.5 font-medium">
            {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"].map((m) => (
              <span key={m}>{m}</span>
            ))}
          </div>
        </div>

        <div className="mt-6 pt-5 border-t border-slate-100">
          <div className="flex items-center justify-between mb-3.5">
            <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Top subscriptions
            </p>
            <span className="text-[11px] font-medium text-indigo-500">View all</span>
          </div>
          <ul className="space-y-3">
            {SUBS.map(({ merchant, amount }) => (
              <li key={merchant} className="flex items-center justify-between gap-2">
                <span className="flex items-center gap-3 min-w-0">
                  <span className="w-9 h-9 rounded-xl bg-white border border-slate-100 flex items-center justify-center shrink-0 shadow-sm">
                    <MerchantLogoIcon merchant={merchant} size={22} />
                  </span>
                  <span className="text-sm font-medium truncate text-slate-800">{merchant}</span>
                </span>
                <span className="text-sm font-semibold text-slate-900 shrink-0">₹{amount}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

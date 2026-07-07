"use client";

import Link from "next/link";
import { DashCard } from "./DashCard";
import { formatInr } from "@/lib/currency";

const INSIGHTS = [
  {
    icon: "🔔",
    bg: "bg-amber-50",
    title: "Unused subscription",
    description: "You haven't used Adobe in 60 days. Consider canceling.",
    cta: "Review",
    href: "/dashboard/subscriptions",
  },
  {
    icon: "📈",
    bg: "bg-orange-50",
    title: "Price increase",
    description: "Netflix may have increased by ₹50 this month.",
    cta: "Details",
    href: "/dashboard/alerts",
  },
  {
    icon: "💡",
    bg: "bg-violet-50",
    title: "Potential savings",
    description: "Switch to annual billing and save on 2 subscriptions.",
    cta: "See tips",
    href: "/dashboard/insights",
  },
];

export function AiInsightsPanel({ savingsAmount }: { savingsAmount: number }) {
  return (
    <div className="space-y-6">
      <DashCard className="p-6 bg-gradient-to-br from-violet-50 via-pink-50 to-orange-50 border-violet-100/50">
        <p className="text-sm font-medium text-violet-600">AI Insight</p>
        <p className="mt-2 text-2xl font-bold text-slate-900">
          You can save {formatInr(savingsAmount * 12)}/year
        </p>
        <p className="mt-2 text-sm text-slate-600 leading-relaxed">
          Based on at-risk and duplicate subscriptions in your account.
        </p>
        <Link
          href="/dashboard/insights"
          className="dash-btn-primary inline-flex mt-4 px-4 py-2.5 text-sm font-semibold"
        >
          View Insights
        </Link>
      </DashCard>

      <DashCard className="p-6">
        <h2 className="text-base font-semibold text-slate-900 mb-4">AI Recommendations</h2>
        <ul className="space-y-4">
          {INSIGHTS.map((item) => (
            <li key={item.title} className="flex gap-3">
              <span className={`w-10 h-10 rounded-xl ${item.bg} flex items-center justify-center text-lg shrink-0`}>
                {item.icon}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-900">{item.title}</p>
                <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{item.description}</p>
                <Link href={item.href} className="text-xs font-semibold text-[#5B5CEB] mt-1 inline-block hover:underline">
                  {item.cta} →
                </Link>
              </div>
            </li>
          ))}
        </ul>
      </DashCard>
    </div>
  );
}

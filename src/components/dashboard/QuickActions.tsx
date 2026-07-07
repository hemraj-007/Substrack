import Link from "next/link";
import { DashCard } from "./DashCard";

const ACTIONS = [
  {
    href: "/dashboard/upload",
    label: "Upload Statement",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
      </svg>
    ),
    bg: "bg-violet-50 text-violet-600",
  },
  {
    href: "/dashboard/subscriptions",
    label: "Add Subscription",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
      </svg>
    ),
    bg: "bg-pink-50 text-pink-500",
  },
  {
    href: "/dashboard/renewals",
    label: "Check Renewals",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    bg: "bg-orange-50 text-orange-500",
  },
  {
    href: "/dashboard/analytics",
    label: "View Analytics",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    bg: "bg-sky-50 text-sky-500",
  },
];

export function QuickActions() {
  return (
    <section>
      <h2 className="text-base font-semibold text-slate-900 mb-4">Quick Actions</h2>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {ACTIONS.map((action) => (
          <Link
            key={action.label}
            href={action.href}
            className="dash-card dash-card-hover p-5 flex flex-col items-center text-center gap-3"
          >
            <span className={`w-11 h-11 rounded-2xl ${action.bg} flex items-center justify-center`}>
              {action.icon}
            </span>
            <span className="text-sm font-semibold text-slate-700">{action.label}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}

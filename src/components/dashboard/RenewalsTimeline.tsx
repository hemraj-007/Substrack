"use client";

import Link from "next/link";
import { MerchantLogoIcon } from "@/components/landing/MerchantLogoIcon";
import { formatInr } from "@/lib/currency";
import { DashCard } from "./DashCard";
import type { UpcomingRenewal } from "@/lib/api";

function renewalLabel(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const target = new Date(date);
  target.setHours(0, 0, 0, 0);
  const diff = Math.round((target.getTime() - now.getTime()) / 86400000);
  if (diff <= 0) return "Today";
  if (diff === 1) return "Tomorrow";
  if (diff <= 7) return `In ${diff} days`;
  return date.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

function pillClass(label: string): string {
  if (label === "Tomorrow" || label === "Today") return "bg-amber-50 text-amber-600 border-amber-100";
  if (label.startsWith("In 3") || label.startsWith("In 4") || label.startsWith("In 5"))
    return "bg-violet-50 text-violet-600 border-violet-100";
  return "bg-slate-50 text-slate-600 border-slate-100";
}

export function RenewalsTimeline({ items }: { items: UpcomingRenewal[] }) {
  return (
    <DashCard className="p-6">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-base font-semibold text-slate-900">Upcoming Renewals</h2>
        <Link href="/dashboard/renewals" className="text-sm font-medium text-[#5B5CEB] hover:underline">
          View all
        </Link>
      </div>
      {items.length === 0 ? (
        <p className="text-sm text-slate-500">No renewals in the next 30 days.</p>
      ) : (
        <ul className="space-y-4">
          {items.map((item) => {
            const when = renewalLabel(item.nextCharge);
            return (
              <li key={item.id} className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-white border border-[#ECECF6] flex items-center justify-center shrink-0 shadow-sm">
                  <MerchantLogoIcon merchant={item.merchant} size={22} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-slate-900 truncate">{item.merchant}</p>
                  <p className="text-xs text-slate-500">
                    {new Date(item.nextCharge).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-semibold text-slate-900">{formatInr(item.amount)}</p>
                  <span className={`inline-block mt-1 text-[10px] font-semibold px-2 py-0.5 rounded-full border ${pillClass(when)}`}>
                    {when}
                  </span>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </DashCard>
  );
}

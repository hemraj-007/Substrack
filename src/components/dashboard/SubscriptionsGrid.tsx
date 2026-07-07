"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { MerchantLogoIcon } from "@/components/landing/MerchantLogoIcon";
import { formatInr } from "@/lib/currency";
import { categorizeMerchant } from "@/lib/categories";
import { DashCard } from "./DashCard";
import type { Subscription } from "@/lib/api";

const STATUS_OPTIONS = ["All", "ACTIVE", "AT_RISK", "CANCELED"] as const;

function statusBadge(status: string) {
  const s = status.toUpperCase();
  if (s === "AT_RISK") return "bg-amber-50 text-amber-600 border-amber-100";
  if (s === "CANCELED") return "bg-slate-100 text-slate-500 border-slate-200";
  return "bg-emerald-50 text-emerald-600 border-emerald-100";
}

export function SubscriptionsGrid({ subscriptions }: { subscriptions: Subscription[] }) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [status, setStatus] = useState("All");

  const filtered = useMemo(() => {
    return subscriptions.filter((sub) => {
      const merchant = String(sub.merchant ?? "").toLowerCase();
      if (search && !merchant.includes(search.toLowerCase())) return false;
      if (category !== "All" && categorizeMerchant(merchant) !== category) return false;
      if (status !== "All" && (sub.status ?? "").toUpperCase() !== status) return false;
      return true;
    });
  }, [subscriptions, search, category, status]);

  const categories = useMemo(() => {
    const set = new Set(subscriptions.map((s) => categorizeMerchant(String(s.merchant ?? ""))));
    return ["All", ...Array.from(set)];
  }, [subscriptions]);

  return (
    <section className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">Subscriptions</h2>
          <p className="text-sm text-slate-500 mt-1">Manage your recurring charges</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <input
            type="search"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="dash-search h-10 px-4 text-sm w-full sm:w-44"
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="dash-search h-10 px-3 text-sm"
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="dash-search h-10 px-3 text-sm"
          >
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s === "All" ? "All status" : s.replace("_", " ")}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        {filtered.map((sub) => {
          const next = sub.nextCharge
            ? new Date(sub.nextCharge).toLocaleDateString("en-IN", { day: "numeric", month: "short" })
            : "—";
          return (
            <Link
              key={sub.id}
              href={`/dashboard/subscriptions/${sub.id}`}
              className="dash-card dash-card-hover p-5 group"
            >
              <div className="flex items-start justify-between">
                <div className="w-11 h-11 rounded-xl bg-white border border-[#ECECF6] flex items-center justify-center shadow-sm">
                  <MerchantLogoIcon merchant={String(sub.merchant)} size={24} />
                </div>
                <span
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${statusBadge(String(sub.status ?? "ACTIVE"))}`}
                >
                  {(sub.status ?? "ACTIVE").replace("_", " ")}
                </span>
              </div>
              <h3 className="mt-4 font-semibold text-slate-900 group-hover:text-[#5B5CEB] transition-colors truncate">
                {sub.merchant}
              </h3>
              <p className="text-xl font-bold text-slate-900 mt-1">
                {formatInr(Number(sub.amount))}
                <span className="text-sm font-normal text-slate-400">/mo</span>
              </p>
              <p className="text-xs text-slate-500 mt-2">Renews {next}</p>
            </Link>
          );
        })}

        <Link
          href="/dashboard/upload"
          className="dash-card border-2 border-dashed border-[#ECECF6] bg-white/40 hover:bg-violet-50/30 hover:border-violet-200 flex flex-col items-center justify-center min-h-[180px] gap-2 transition-all hover:scale-[1.02]"
        >
          <span className="w-12 h-12 rounded-full bg-violet-50 text-[#5B5CEB] flex items-center justify-center text-2xl font-light">
            +
          </span>
          <span className="text-sm font-semibold text-slate-600">Add subscription</span>
        </Link>
      </div>
    </section>
  );
}

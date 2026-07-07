"use client";

import Link from "next/link";
import { MerchantLogoIcon } from "@/components/landing/MerchantLogoIcon";
import { formatInr } from "@/lib/currency";
import { categorizeMerchant } from "@/lib/categories";
import { DashCard } from "./DashCard";

type Tx = {
  id: string;
  merchant?: string;
  amount?: number;
  date?: string;
  type?: string;
};

export function TransactionsPanel({ transactions }: { transactions: Tx[] }) {
  const recent = [...transactions]
    .filter((t) => t.type !== "CREDIT")
    .sort((a, b) => new Date(String(b.date)).getTime() - new Date(String(a.date)).getTime())
    .slice(0, 6);

  return (
    <DashCard className="p-6">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-base font-semibold text-slate-900">Recent Transactions</h2>
        <Link href="/dashboard/transactions" className="text-sm font-medium text-[#5B5CEB] hover:underline">
          View all
        </Link>
      </div>
      {recent.length === 0 ? (
        <p className="text-sm text-slate-500">No transactions yet.</p>
      ) : (
        <ul className="divide-y divide-[#ECECF6]">
          {recent.map((tx) => (
            <li key={tx.id}>
              <Link
                href="/dashboard/transactions"
                className="flex items-center gap-3 py-3.5 -mx-2 px-2 rounded-xl hover:bg-violet-50/50 transition-colors"
              >
                <div className="w-9 h-9 rounded-xl bg-white border border-[#ECECF6] flex items-center justify-center shrink-0">
                  <MerchantLogoIcon merchant={String(tx.merchant ?? "")} size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900 truncate">{tx.merchant}</p>
                  <p className="text-xs text-slate-500">
                    {categorizeMerchant(String(tx.merchant ?? ""))} ·{" "}
                    {new Date(String(tx.date)).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                    })}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-semibold text-slate-900">{formatInr(Number(tx.amount))}</p>
                  <span className="text-[10px] text-emerald-600 font-medium">Completed</span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </DashCard>
  );
}

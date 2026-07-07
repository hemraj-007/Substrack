"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { formatInr } from "@/lib/currency";

type Slice = { name: string; value: number; color: string; last4?: string };

export function CardSpendDonut({
  data,
  totalLabel = "Total spend",
}: {
  data: Slice[];
  totalLabel?: string;
}) {
  const filtered = data.filter((d) => d.value > 0);
  const total = filtered.reduce((s, d) => s + d.value, 0);

  if (filtered.length === 0) {
    return (
      <p className="text-sm text-slate-500 text-center py-12">No spending data this month.</p>
    );
  }

  return (
    <div className="flex flex-col sm:flex-row items-center gap-6">
      <div className="relative w-[200px] h-[200px] shrink-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={filtered}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={62}
              outerRadius={88}
              paddingAngle={3}
              strokeWidth={0}
            >
              {filtered.map((entry) => (
                <Cell key={entry.name} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value) => [`₹${Number(value ?? 0).toLocaleString("en-IN")}`, ""]}
              contentStyle={{
                borderRadius: 14,
                border: "1px solid #ECECF6",
                boxShadow: "0 10px 40px rgba(91,92,235,0.08)",
              }}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center px-4">
          <p className="text-lg font-bold text-slate-900 leading-tight">{formatInr(total)}</p>
          <p className="text-[11px] text-slate-500 mt-0.5">{totalLabel}</p>
        </div>
      </div>

      <ul className="flex-1 space-y-3 w-full min-w-[160px]">
        {filtered.map((item) => {
          const pct = total > 0 ? Math.round((item.value / total) * 100) : 0;
          return (
            <li key={item.name} className="flex items-center justify-between gap-3 text-sm">
              <span className="flex items-center gap-2.5 min-w-0">
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-slate-700 truncate">
                  {item.name}
                  {item.last4 ? ` •••• ${item.last4}` : ""}
                </span>
              </span>
              <span className="font-semibold text-slate-900 shrink-0 whitespace-nowrap">
                {formatInr(item.value)}{" "}
                <span className="text-slate-400 font-normal">({pct}%)</span>
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

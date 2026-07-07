"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

type Point = { label: string; value: number };

export function DashboardBarChart({ data }: { data: Point[] }) {
  const max = Math.max(...data.map((d) => d.value), 1);

  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
        <XAxis dataKey="label" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
        <YAxis hide />
        <Tooltip
          formatter={(value) => [`₹${Number(value ?? 0).toLocaleString("en-IN")}`, "Spend"]}
          contentStyle={{
            borderRadius: 14,
            border: "1px solid #ECECF6",
            boxShadow: "0 10px 40px rgba(91,92,235,0.08)",
          }}
        />
        <Bar dataKey="value" radius={[10, 10, 10, 10]} maxBarSize={36}>
          {data.map((entry) => (
            <Cell
              key={entry.label}
              fill={entry.value === max ? "#5B5CEB" : "#C4B5FD"}
              opacity={entry.value === max ? 1 : 0.75}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

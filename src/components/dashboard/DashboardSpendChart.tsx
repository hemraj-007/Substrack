"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

type Point = { label: string; value: number };

export function DashboardSpendChart({ data }: { data: Point[] }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <LineChart data={data} margin={{ top: 12, right: 12, left: -8, bottom: 0 }}>
        <defs>
          <linearGradient id="dashLineGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#5B5CEB" />
            <stop offset="100%" stopColor="#8B5CF6" />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="4 4" stroke="#ECECF6" vertical={false} />
        <XAxis dataKey="label" tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
        <YAxis
          tick={{ fontSize: 11, fill: "#94a3b8" }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v) => (v >= 1000 ? `₹${(v / 1000).toFixed(0)}k` : `₹${v}`)}
        />
        <Tooltip
          formatter={(value) => [`₹${Number(value ?? 0).toLocaleString("en-IN")}`, "Spend"]}
          contentStyle={{
            borderRadius: 14,
            border: "1px solid #ECECF6",
            boxShadow: "0 10px 40px rgba(91,92,235,0.08)",
          }}
        />
        <Line
          type="monotone"
          dataKey="value"
          stroke="url(#dashLineGrad)"
          strokeWidth={3}
          dot={{ r: 4, fill: "#5B5CEB", strokeWidth: 0 }}
          activeDot={{ r: 6, fill: "#8B5CF6" }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

type Slice = { name: string; value: number; color: string };

export function CategoryDonutChart({ data }: { data: Slice[] }) {
  const filtered = data.filter((d) => d.value > 0);
  if (filtered.length === 0) {
    return (
      <p className="text-sm text-[var(--muted)] text-center py-12">No category data yet.</p>
    );
  }

  return (
    <div className="flex flex-col sm:flex-row items-center gap-4">
      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie
            data={filtered}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={80}
            paddingAngle={2}
          >
            {filtered.map((entry) => (
              <Cell key={entry.name} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value) => [
              `₹${Number(value ?? 0).toLocaleString("en-IN")}`,
              "",
            ]}
            contentStyle={{
              borderRadius: 12,
              border: "1px solid var(--border)",
            }}
          />
        </PieChart>
      </ResponsiveContainer>
      <ul className="flex-1 space-y-2 w-full sm:w-auto min-w-[140px]">
        {filtered.map((item) => (
          <li key={item.name} className="flex items-center justify-between text-sm gap-2">
            <span className="flex items-center gap-2 text-[var(--foreground)]">
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{ backgroundColor: item.color }}
              />
              {item.name}
            </span>
            <span className="font-medium text-[var(--foreground)]">
              ₹{item.value.toLocaleString("en-IN")}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

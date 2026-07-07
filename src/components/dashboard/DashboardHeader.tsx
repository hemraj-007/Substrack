"use client";

export type DateRange = "today" | "30d" | "month";

const OPTIONS: { value: DateRange; label: string }[] = [
  { value: "today", label: "Today" },
  { value: "30d", label: "Last 30 Days" },
  { value: "month", label: "This Month" },
];

export function DashboardHeader({
  name,
  range,
  onRangeChange,
}: {
  name: string;
  range: DateRange;
  onRangeChange: (r: DateRange) => void;
}) {
  const hour = new Date().getHours();
  const greet = hour < 12 ? "Good Morning" : hour < 17 ? "Good Afternoon" : "Good Evening";

  return (
    <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
      <div>
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight capitalize">
          {greet}, {name} 👋
        </h1>
        <p className="text-sm text-slate-500 mt-2">Here&apos;s your financial overview.</p>
      </div>
      <div className="flex rounded-2xl border border-[#ECECF6] bg-white/80 p-1 shadow-sm">
        {OPTIONS.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => onRangeChange(opt.value)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
              range === opt.value
                ? "bg-gradient-to-r from-[#5B5CEB] to-[#8B5CF6] text-white shadow-sm"
                : "text-slate-500 hover:text-slate-900 hover:bg-violet-50"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </header>
  );
}

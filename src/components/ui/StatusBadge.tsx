type Variant =
  | "active"
  | "at_risk"
  | "canceled"
  | "renewal"
  | "price_hike"
  | "unused"
  | "normal"
  | "high";

const STYLES: Record<Variant, string> = {
  active: "bg-emerald-50 text-emerald-700 border-emerald-200",
  at_risk: "bg-amber-50 text-amber-800 border-amber-200",
  canceled: "bg-slate-100 text-slate-600 border-slate-200",
  renewal: "bg-blue-50 text-blue-700 border-blue-200",
  price_hike: "bg-orange-50 text-orange-700 border-orange-200",
  unused: "bg-violet-50 text-violet-700 border-violet-200",
  normal: "bg-emerald-50 text-emerald-700 border-emerald-200",
  high: "bg-red-50 text-red-700 border-red-200",
};

const LABELS: Record<Variant, string> = {
  active: "Active",
  at_risk: "At risk",
  canceled: "Canceled",
  renewal: "Renewal",
  price_hike: "Price hike",
  unused: "Unused",
  normal: "Normal",
  high: "High charge",
};

export function StatusBadge({
  variant,
  label,
  className = "",
}: {
  variant: Variant;
  label?: string;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${STYLES[variant]} ${className}`}
    >
      {label ?? LABELS[variant]}
    </span>
  );
}

export function alertTypeToVariant(type: string): Variant {
  const t = type.toUpperCase();
  if (t === "RENEWAL") return "renewal";
  if (t === "PRICE_HIKE") return "price_hike";
  if (t === "UNUSED") return "unused";
  return "renewal";
}

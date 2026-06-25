export function formatInr(amount: number, options?: { maximumFractionDigits?: number }) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: options?.maximumFractionDigits ?? 0,
  }).format(amount);
}

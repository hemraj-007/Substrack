export type SpendCategory =
  | "Streaming"
  | "Productivity"
  | "Shopping"
  | "Utilities"
  | "Food"
  | "Other";

const RULES: Array<{ category: SpendCategory; pattern: RegExp }> = [
  { category: "Streaming", pattern: /netflix|spotify|prime|disney|hulu|youtube|hotstar/i },
  {
    category: "Productivity",
    pattern: /notion|adobe|figma|canva|github|slack|zoom|chatgpt|cursor|claude|microsoft/i,
  },
  { category: "Shopping", pattern: /amazon|flipkart|instacart|walmart|shopping/i },
  { category: "Utilities", pattern: /icloud|google one|dropbox|vpn|internet|cloud|electricity/i },
  { category: "Food", pattern: /swiggy|zomato|uber eats|food/i },
];

export function categorizeMerchant(merchant: string): SpendCategory {
  for (const { category, pattern } of RULES) {
    if (pattern.test(merchant)) return category;
  }
  return "Other";
}

export const CATEGORY_COLORS: Record<SpendCategory, string> = {
  Streaming: "#8b5cf6",
  Productivity: "#2563eb",
  Shopping: "#f59e0b",
  Utilities: "#10b981",
  Food: "#ec4899",
  Other: "#94a3b8",
};

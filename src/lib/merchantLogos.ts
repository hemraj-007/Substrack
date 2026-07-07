/** Brand colors and initials for subscription/transaction merchant display. */
const BRANDS: Record<string, { bg: string; color: string; initial: string }> = {
  netflix: { bg: "#E50914", color: "#fff", initial: "N" },
  spotify: { bg: "#1DB954", color: "#fff", initial: "S" },
  amazon: { bg: "#FF9900", color: "#111", initial: "A" },
  "amazon prime": { bg: "#00A8E1", color: "#fff", initial: "P" },
  youtube: { bg: "#FF0000", color: "#fff", initial: "Y" },
  apple: { bg: "#555", color: "#fff", initial: "A" },
  "apple icloud": { bg: "#007AFF", color: "#fff", initial: "i" },
  google: { bg: "#4285F4", color: "#fff", initial: "G" },
  microsoft: { bg: "#00A4EF", color: "#fff", initial: "M" },
  adobe: { bg: "#FF0000", color: "#fff", initial: "Ad" },
  notion: { bg: "#000", color: "#fff", initial: "N" },
  figma: { bg: "#A259FF", color: "#fff", initial: "F" },
  canva: { bg: "#00C4CC", color: "#fff", initial: "C" },
  github: { bg: "#24292e", color: "#fff", initial: "GH" },
  slack: { bg: "#4A154B", color: "#fff", initial: "S" },
  zoom: { bg: "#2D8CFF", color: "#fff", initial: "Z" },
  disney: { bg: "#113CCF", color: "#fff", initial: "D+" },
  dropbox: { bg: "#0061FF", color: "#fff", initial: "D" },
  cursor: { bg: "#000", color: "#fff", initial: "Cu" },
  chatgpt: { bg: "#10A37F", color: "#fff", initial: "AI" },
};

export function getMerchantBrand(merchant: string) {
  const key = merchant.toLowerCase().trim();
  for (const [pattern, brand] of Object.entries(BRANDS)) {
    if (key.includes(pattern)) return brand;
  }
  const initial = merchant.trim().charAt(0).toUpperCase() || "?";
  return { bg: "#6366f1", color: "#fff", initial };
}

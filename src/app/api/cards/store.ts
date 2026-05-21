import fs from "fs";
import path from "path";

export type StoredCard = {
  id: string;
  userId: string;
  last4: string;
  bankName: string | null;
  network: string | null;
  createdAt: string;
};

const dataDir = path.join(process.cwd(), "data");
const cardsPath = path.join(dataDir, "cards.json");

function loadCards(): Map<string, StoredCard> {
  try {
    const raw = fs.readFileSync(cardsPath, "utf-8");
    const entries = JSON.parse(raw) as [string, StoredCard][];
    return new Map(entries);
  } catch {
    return new Map();
  }
}

export function persistCards(): void {
  try {
    fs.mkdirSync(dataDir, { recursive: true });
    fs.writeFileSync(
      cardsPath,
      JSON.stringify(Array.from(cards.entries()), null, 2),
      "utf-8"
    );
  } catch (e) {
    console.error("Failed to persist cards:", e);
  }
}

const g = globalThis as typeof globalThis & { __cards?: Map<string, StoredCard> };
export const cards = (() => {
  if (!g.__cards) g.__cards = loadCards();
  return g.__cards;
})();

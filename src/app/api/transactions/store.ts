import fs from "fs";
import path from "path";

export type StoredTransaction = {
  id: string;
  cardId: string;
  merchant: string | null;
  description: string | null;
  amount: number;
  currency: string;
  date: string;
};

const dataDir = path.join(process.cwd(), "data");
const transactionsPath = path.join(dataDir, "transactions.json");

function loadTransactions(): Map<string, StoredTransaction> {
  try {
    const raw = fs.readFileSync(transactionsPath, "utf-8");
    const entries = JSON.parse(raw) as [string, StoredTransaction][];
    return new Map(entries);
  } catch {
    return new Map();
  }
}

export function persistTransactions(): void {
  try {
    fs.mkdirSync(dataDir, { recursive: true });
    fs.writeFileSync(
      transactionsPath,
      JSON.stringify(Array.from(transactions.entries()), null, 2),
      "utf-8"
    );
  } catch (e) {
    console.error("Failed to persist transactions:", e);
  }
}

const g = globalThis as typeof globalThis & { __transactions?: Map<string, StoredTransaction> };
export const transactions = (() => {
  if (!g.__transactions) g.__transactions = loadTransactions();
  return g.__transactions;
})();

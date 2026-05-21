import fs from "fs";
import path from "path";

export type StoredSubscription = {
  id: string;
  userId: string;
  merchant: string;
  amount: number;
  frequency: string;
  status: "ACTIVE" | "AT_RISK" | "CANCELED" | string;
  lastCharged?: string;
  nextCharge?: string;
};

const dataDir = path.join(process.cwd(), "data");
const subscriptionsPath = path.join(dataDir, "subscriptions.json");

function loadSubscriptions(): Map<string, StoredSubscription> {
  try {
    const raw = fs.readFileSync(subscriptionsPath, "utf-8");
    const entries = JSON.parse(raw) as [string, StoredSubscription][];
    return new Map(entries);
  } catch {
    return new Map();
  }
}

export function persistSubscriptions(): void {
  try {
    fs.mkdirSync(dataDir, { recursive: true });
    fs.writeFileSync(
      subscriptionsPath,
      JSON.stringify(Array.from(subscriptions.entries()), null, 2),
      "utf-8"
    );
  } catch (e) {
    console.error("Failed to persist subscriptions:", e);
  }
}

const g = globalThis as typeof globalThis & {
  __subscriptions?: Map<string, StoredSubscription>;
};

export const subscriptions = (() => {
  if (!g.__subscriptions) g.__subscriptions = loadSubscriptions();
  return g.__subscriptions;
})();


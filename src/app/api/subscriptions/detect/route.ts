import { NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { getAuthUserFromRequest } from "../../auth/getAuthUser";
import { cards } from "../../cards/store";
import { transactions, type StoredTransaction } from "../../transactions/store";
import { subscriptions, type StoredSubscription, persistSubscriptions } from "../store"; 

const MS_PER_DAY = 24 * 60 * 60 * 1000;

function parseDate(input: string): Date | null {
  const direct = new Date(input);
  if (!Number.isNaN(direct.getTime())) return direct;

  const m = input.match(/^(\d{2})[/-](\d{2})[/-](\d{4})$/);
  if (!m) return null;
  const [, dd, mm, yyyy] = m;
  const d = new Date(Number(yyyy), Number(mm) - 1, Number(dd));
  return Number.isNaN(d.getTime()) ? null : d;
}

function formatDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function addDays(date: Date, days: number): string {
  const next = new Date(date.getTime() + days * MS_PER_DAY);
  return formatDate(next);
}

function inferFrequency(daysBetween: number): {
  frequency: string;
  intervalDays?: number;
} {
  if (!Number.isFinite(daysBetween) || daysBetween <= 0) {
    return { frequency: "unknown" };
  }

  if (daysBetween >= 6 && daysBetween <= 10) {
    return { frequency: "weekly", intervalDays: 7 };
  }

  if (daysBetween >= 20 && daysBetween <= 40) {
    return { frequency: "monthly", intervalDays: 30 };
  }

  if (daysBetween >= 330 && daysBetween <= 400) {
    return { frequency: "yearly", intervalDays: 365 };
  }

  return { frequency: "unknown" };
}

export async function POST(request: Request) {
  const user = getAuthUserFromRequest(request);
  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  const userCardIds = new Set(
    Array.from(cards.values()).filter((c) => c.userId === user.id).map((c) => c.id)
  );
  const byMerchant = new Map<string, StoredTransaction[]>();

  for (const tx of transactions.values()) {
    if (!userCardIds.has(tx.cardId)) continue;
    const merchantKey = (tx.merchant ?? "").trim().toLowerCase();
    if (!merchantKey) continue;

    const parsedDate = parseDate(tx.date);
    if (!parsedDate) continue;

    const list = byMerchant.get(merchantKey) ?? [];
    list.push(tx);
    byMerchant.set(merchantKey, list);
  }

  for (const [id, sub] of subscriptions.entries()) {
    if (sub.userId === user.id) subscriptions.delete(id);
  }
  const detected: StoredSubscription[] = [];

  for (const [, txList] of byMerchant.entries()) {
    const withParsed = txList
      .map((tx) => ({ tx, date: parseDate(tx.date) }))
      .filter((item) => item.date !== null) as { tx: StoredTransaction; date: Date }[];

    if (withParsed.length === 0) continue;

    withParsed.sort((a, b) => a.date.getTime() - b.date.getTime()); 
    const last = withParsed[withParsed.length - 1];

    let frequency: string;
    let nextCharge: string | undefined;

    if (withParsed.length >= 2) {
      const previous = withParsed[withParsed.length - 2];
      const diffDays = Math.round(
        (last.date.getTime() - previous.date.getTime()) / MS_PER_DAY
      );
      const inferred = inferFrequency(diffDays);
      frequency = inferred.frequency;
      nextCharge =
        inferred.intervalDays != null
          ? addDays(last.date, inferred.intervalDays)
          : undefined;
    } else {
      frequency = "unknown";
    }

    const id = randomBytes(8).toString("hex");
    const subscription: StoredSubscription = {
      id,
      userId: user.id,
      merchant: last.tx.merchant ?? "Unknown",
      amount: last.tx.amount,
      frequency,
      status: "ACTIVE",
      lastCharged: formatDate(last.date),
      nextCharge,
    };

    subscriptions.set(id, subscription);
    detected.push(subscription);
  }

  persistSubscriptions();
  return NextResponse.json(detected);
}

import { NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { getAuthUserFromRequest } from "../auth/getAuthUser";
import { cards } from "../cards/store";
import { subscriptions, type StoredSubscription } from "../subscriptions/store";
import { transactions, type StoredTransaction } from "../transactions/store";

const MS_PER_DAY = 24 * 60 * 60 * 1000;

type AlertType = "RENEWAL" | "PRICE_HIKE" | "UNUSED";

type GeneratedAlert = {
  id: string;
  type: AlertType;
  message: string;
  scheduledAt: string;
  sentAt: string | null;
};

function parseDate(input: string): Date | null {
  const d = new Date(input);
  return Number.isNaN(d.getTime()) ? null : d;
}

function formatDate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function daysBetween(a: string, b: string): number {
  const da = parseDate(a);
  const db = parseDate(b);
  if (!da || !db) return NaN;
  return Math.round((db.getTime() - da.getTime()) / MS_PER_DAY);
}

function getIntervalDays(frequency: string): number | null {
  const f = frequency.toLowerCase();
  if (f === "weekly") return 7;
  if (f === "monthly") return 30;
  if (f === "yearly") return 365;
  return null;
}

/** Renewal alerts: one per subscription with nextCharge, scheduled 3 days before next charge. */
function buildRenewalAlerts(subs: Map<string, StoredSubscription>): GeneratedAlert[] {
  const alerts: GeneratedAlert[] = [];
  const now = new Date();
  const today = formatDate(now);

  for (const sub of subs.values()) {
    if (!sub.nextCharge || sub.status === "CANCELED") continue;

    const nextChargeDate = parseDate(sub.nextCharge);
    if (!nextChargeDate) continue;

    const reminderDays = 3;
    const reminder = new Date(nextChargeDate.getTime() - reminderDays * MS_PER_DAY);
    const scheduledAt = formatDate(reminder);

    // Only show renewal alerts that are due (scheduled date is today or in the past) or up to 14 days in the future
    const daysUntilScheduled = daysBetween(today, scheduledAt);
    if (daysUntilScheduled > 14) continue;

    const amountStr = typeof sub.amount === "number" ? `$${sub.amount.toFixed(2)}` : "";
    const message = amountStr
      ? `${sub.merchant} renews on ${sub.nextCharge} (${amountStr})`
      : `${sub.merchant} renews on ${sub.nextCharge}`;

    alerts.push({
      id: randomBytes(8).toString("hex"),
      type: "RENEWAL",
      message,
      scheduledAt,
      sentAt: null,
    });
  }

  return alerts;
}

/** Price hike: compare last two charges per merchant; if amount increased, create alert. */
function buildPriceHikeAlerts(
  subs: Map<string, StoredSubscription>,
  txMap: Map<string, StoredTransaction[]>
): GeneratedAlert[] {
  const alerts: GeneratedAlert[] = [];
  const now = new Date();
  const cutoff = new Date(now.getTime() - 180 * MS_PER_DAY); // only consider last ~6 months

  for (const [, txList] of txMap.entries()) {
    if (txList.length < 2) continue;

    const withDate = txList
      .map((tx) => ({ tx, date: parseDate(tx.date) }))
      .filter((x): x is { tx: StoredTransaction; date: Date } => x.date !== null && x.date >= cutoff);

    if (withDate.length < 2) continue;

    withDate.sort((a, b) => b.date.getTime() - a.date.getTime()); // newest first
    const latest = withDate[0];
    const previous = withDate[1];
    if (latest.tx.amount <= previous.tx.amount) continue;

    const merchant = latest.tx.merchant ?? "Unknown";
    const message = `${merchant}: price increased from $${previous.tx.amount.toFixed(2)} to $${latest.tx.amount.toFixed(2)}`;

    alerts.push({
      id: randomBytes(8).toString("hex"),
      type: "PRICE_HIKE",
      message,
      scheduledAt: formatDate(latest.date),
      sentAt: null,
    });
  }

  return alerts;
}

/** Unused: subscription with no charge within 1.5x its billing interval. */
function buildUnusedAlerts(subs: Map<string, StoredSubscription>): GeneratedAlert[] {
  const alerts: GeneratedAlert[] = [];
  const today = formatDate(new Date());

  for (const sub of subs.values()) {
    if (sub.status === "CANCELED" || !sub.lastCharged) continue;

    const intervalDays = getIntervalDays(sub.frequency);
    if (intervalDays == null) continue;

    const graceDays = Math.ceil(intervalDays * 1.5);
    const daysSinceCharge = daysBetween(sub.lastCharged, today);
    if (!Number.isFinite(daysSinceCharge) || daysSinceCharge < graceDays) continue;

    const message = `${sub.merchant} hasn't charged in ${daysSinceCharge} days (expected every ~${intervalDays} days). You may want to cancel.`;

    alerts.push({
      id: randomBytes(8).toString("hex"),
      type: "UNUSED",
      message,
      scheduledAt: sub.lastCharged,
      sentAt: null,
    });
  }

  return alerts;
}

export async function GET(request: Request) {
  const user = getAuthUserFromRequest(request);
  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  try {
    const userCardIds = new Set(
      Array.from(cards.values()).filter((c) => c.userId === user.id).map((c) => c.id)
    );
    const userSubs = new Map(
      Array.from(subscriptions.entries()).filter(([, s]) => (s as { userId?: string }).userId === user.id)
    );
    const txValues = Array.from(transactions.values()).filter((tx) => userCardIds.has(tx.cardId));
    const byMerchant = new Map<string, StoredTransaction[]>();
    for (const tx of txValues) {
      const key = (tx.merchant ?? "").trim().toLowerCase();
      if (!key) continue;
      const list = byMerchant.get(key) ?? [];
      list.push(tx);
      byMerchant.set(key, list);
    }

    const renewal = buildRenewalAlerts(userSubs);
    const priceHike = buildPriceHikeAlerts(userSubs, byMerchant);
    const unused = buildUnusedAlerts(userSubs);

    const all: GeneratedAlert[] = [...renewal, ...priceHike, ...unused];
    all.sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime());

    return NextResponse.json(all);
  } catch (err) {
    console.error("[alerts] GET error:", err);
    return NextResponse.json([]);
  }
}

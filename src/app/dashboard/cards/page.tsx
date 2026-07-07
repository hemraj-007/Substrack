"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useFetch } from "@/hooks/useFetch";
import { cardsApi, subscriptionsApi, transactionsApi } from "@/lib/api";
import { LoadingState } from "@/components/Loader";
import { DashCard } from "@/components/dashboard/DashCard";
import { VisualCreditCard } from "@/components/cards/VisualCreditCard";
import { CardSpendDonut } from "@/components/cards/CardSpendDonut";
import { MerchantLogoIcon } from "@/components/landing/MerchantLogoIcon";
import { formatInr } from "@/lib/currency";

const DONUT_COLORS = ["#5B5CEB", "#C4B5FD", "#818CF8", "#A78BFA"];

function isThisMonth(dateStr: string): boolean {
  const d = new Date(dateStr);
  const now = new Date();
  return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
}

export default function CardsPage() {
  const { data: cards = [], isLoading, refetch } = useFetch(
    () => cardsApi.list().then((r) => r.data),
    { deps: [] }
  );
  const { data: transactions = [] } = useFetch(
    () => transactionsApi.list().then((r) => r.data),
    { deps: [] }
  );
  const { data: subscriptions = [] } = useFetch(
    () => subscriptionsApi.list().then((r) => r.data),
    { deps: [] }
  );

  const [showAdd, setShowAdd] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [last4, setLast4] = useState("");
  const [bankName, setBankName] = useState("");
  const [network, setNetwork] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const cardList = cards ?? [];
  const txList = transactions ?? [];
  const subList = subscriptions ?? [];
  const activeId = selectedId ?? cardList[0]?.id ?? null;

  const cardStats = useMemo(() => {
    const stats: Record<string, { subCount: number; monthlySubs: number; monthSpend: number }> = {};
    for (const card of cardList) {
      const cardSubs = subList.filter(
        (s) => s.cardId === card.id && (s.status ?? "").toUpperCase() === "ACTIVE"
      );
      const monthSpend = txList
        .filter((t) => t.cardId === card.id && t.type !== "CREDIT" && isThisMonth(String(t.date)))
        .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);
      stats[card.id] = {
        subCount: cardSubs.length,
        monthlySubs: cardSubs.reduce((sum, s) => sum + (Number(s.amount) || 0), 0),
        monthSpend,
      };
    }
    return stats;
  }, [cardList, subList, txList]);

  const donutData = useMemo(
    () =>
      cardList
        .map((card, i) => ({
          name: card.bankName || `Card ${i + 1}`,
          last4: card.last4,
          value: cardStats[card.id]?.monthSpend ?? 0,
          color: DONUT_COLORS[i % DONUT_COLORS.length]!,
        }))
        .filter((d) => d.value > 0),
    [cardList, cardStats]
  );

  const recentTx = useMemo(() => {
    const pool = txList.filter((t) => {
      if (t.type === "CREDIT") return false;
      if (activeId && t.cardId !== activeId) return false;
      return true;
    });
    return [...pool]
      .sort((a, b) => new Date(String(b.date)).getTime() - new Date(String(a.date)).getTime())
      .slice(0, 5);
  }, [txList, activeId]);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await cardsApi.create({
        last4: last4.replace(/\D/g, "").slice(-4),
        bankName: bankName || undefined,
        network: network || undefined,
      });
      setLast4("");
      setBankName("");
      setNetwork("");
      setShowAdd(false);
      refetch();
    } catch (err: unknown) {
      const msg =
        err && typeof err === "object" && "response" in err
          ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
          : "Failed to add card.";
      setError(String(msg ?? "Failed to add card."));
    } finally {
      setSubmitting(false);
    }
  }

  if (isLoading) return <LoadingState title="Loading cards" />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">My Cards</h1>
        <button
          type="button"
          onClick={() => setShowAdd(true)}
          className="dash-btn-primary px-5 py-2.5 text-sm font-semibold inline-flex items-center gap-2"
        >
          <span className="text-lg leading-none">+</span>
          Add Card
        </button>
      </div>

      {cardList.length === 0 ? (
        <DashCard className="p-12 text-center" hover={false}>
          <p className="text-lg font-semibold text-slate-900">No cards yet</p>
          <p className="text-sm text-slate-500 mt-2">Add a card to track spending and subscriptions.</p>
          <button
            type="button"
            onClick={() => setShowAdd(true)}
            className="dash-btn-primary mt-6 px-6 py-2.5 text-sm font-semibold"
          >
            + Add Card
          </button>
        </DashCard>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[minmax(280px,380px)_1fr]">
          <div className="space-y-5">
            {cardList.map((card, i) => (
              <VisualCreditCard
                key={card.id}
                card={card}
                index={i}
                subscriptionCount={cardStats[card.id]?.subCount ?? 0}
                monthlySpend={cardStats[card.id]?.monthlySubs ?? 0}
                selected={activeId === card.id}
                onClick={() => setSelectedId(card.id)}
              />
            ))}
          </div>

          <div className="space-y-6">
            <DashCard className="p-6" hover={false}>
              <div className="flex items-baseline justify-between mb-6">
                <h2 className="text-base font-semibold text-slate-900">Spending by Card</h2>
                <span className="text-xs text-slate-400">This month</span>
              </div>
              <CardSpendDonut data={donutData} />
            </DashCard>

            <DashCard className="p-6" hover={false}>
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-base font-semibold text-slate-900">Recent Transactions</h2>
                <Link
                  href="/dashboard/transactions"
                  className="text-sm font-medium text-[#5B5CEB] hover:underline inline-flex items-center gap-1"
                >
                  View all
                  <span aria-hidden>→</span>
                </Link>
              </div>
              {recentTx.length === 0 ? (
                <p className="text-sm text-slate-500">No transactions on this card.</p>
              ) : (
                <ul className="divide-y divide-[#ECECF6]">
                  {recentTx.map((tx) => (
                    <li
                      key={tx.id}
                      className="flex items-center justify-between gap-3 py-3.5 first:pt-0 last:pb-0"
                    >
                      <span className="flex items-center gap-3 min-w-0">
                        <span className="w-10 h-10 rounded-xl bg-white border border-[#ECECF6] flex items-center justify-center shrink-0 shadow-sm">
                          <MerchantLogoIcon merchant={String(tx.merchant ?? "")} size={22} />
                        </span>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-slate-900 truncate">
                            {tx.merchant}
                          </p>
                          <p className="text-xs text-slate-400">
                            {new Date(String(tx.date)).toLocaleDateString("en-IN", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            })}
                          </p>
                        </div>
                      </span>
                      <span className="text-sm font-semibold text-slate-900 shrink-0">
                        {formatInr(Number(tx.amount))}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </DashCard>
          </div>
        </div>
      )}

      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            onClick={() => setShowAdd(false)}
            aria-hidden
          />
          <DashCard className="relative w-full max-w-md p-6 z-10" hover={false}>
            <h2 className="text-lg font-semibold text-slate-900">Add card</h2>
            <p className="text-sm text-slate-500 mt-1">Enter your card details to start tracking.</p>
            <form onSubmit={handleAdd} className="mt-5 space-y-3">
              <input
                type="text"
                inputMode="numeric"
                maxLength={4}
                value={last4}
                onChange={(e) => setLast4(e.target.value.replace(/\D/g, "").slice(0, 4))}
                placeholder="Last 4 digits"
                className="dash-search w-full h-12 px-4 text-sm"
                required
              />
              <input
                type="text"
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                placeholder="Bank name (e.g. HDFC Bank)"
                className="dash-search w-full h-12 px-4 text-sm"
              />
              <input
                type="text"
                value={network}
                onChange={(e) => setNetwork(e.target.value)}
                placeholder="Visa, Mastercard…"
                className="dash-search w-full h-12 px-4 text-sm"
              />
              {error && <p className="text-sm text-red-500">{error}</p>}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAdd(false)}
                  className="dash-btn-secondary flex-1 py-2.5 text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="dash-btn-primary flex-1 py-2.5 text-sm font-semibold disabled:opacity-50"
                >
                  {submitting ? "Adding…" : "Add card"}
                </button>
              </div>
            </form>
          </DashCard>
        </div>
      )}
    </div>
  );
}

"use client";

import { useState } from "react";
import { useFetch } from "@/hooks/useFetch";
import { cardsApi } from "@/lib/api";
import { LoadingState } from "@/components/Loader";
import { GlassCard } from "@/components/GlassCard";
import { PageHeaderCard } from "@/components/PageHeaderCard";

export default function CardsPage() {
  const { data: cards = [], isLoading, refetch } = useFetch(
    () => cardsApi.list().then((r) => r.data),
    { deps: [] }
  );
  const [last4, setLast4] = useState("");
  const [bankName, setBankName] = useState("");
  const [network, setNetwork] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await cardsApi.create({ last4: last4.replace(/\D/g, "").slice(-4), bankName: bankName || undefined, network: network || undefined });
      setLast4("");
      setBankName("");
      setNetwork("");
      refetch();
    } catch (err: unknown) {
      const msg = err && typeof err === "object" && "response" in err
        ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
        : "Failed to add card.";
      setError(String(msg ?? "Failed to add card."));
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id: string) {
    setDeletingId(id);
    try {
      await cardsApi.delete(id);
      refetch();
    } finally {
      setDeletingId(null);
    }
  }

  if (isLoading) {
    return (
      <LoadingState
        title="Loading cards"
      />
    );
  }

  const cardList = cards ?? [];

  return (
    <div className="space-y-6 sm:space-y-8">
      <PageHeaderCard
        variant="stacked"
        title="Cards"
        description="Add and manage cards used for subscription transactions."
        showIdentifier={false}
        showDividers={false}
      />

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
        <GlassCard className="p-4 sm:p-6 space-y-4">
          <h2 className="font-semibold text-[var(--foreground)]">Add card</h2>
          <form onSubmit={handleAdd} className="space-y-4">
            <div>
              <label htmlFor="last4" className="block text-sm font-medium text-[var(--foreground)] mb-1">
                Last 4 digits
              </label>
              <input
                id="last4"
                type="text"
                inputMode="numeric"
                maxLength={4}
                value={last4}
                onChange={(e) => setLast4(e.target.value.replace(/\D/g, "").slice(0, 4))}
                placeholder="1234"
                className="surface-input w-full px-3 py-2.5"
                required
              />
            </div>
            <div>
              <label htmlFor="bankName" className="block text-sm font-medium text-[var(--foreground)] mb-1">
                Bank (optional)
              </label>
              <input
                id="bankName"
                type="text"
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                placeholder="Bank name"
                className="surface-input w-full px-3 py-2.5"
              />
            </div>
            <div>
              <label htmlFor="network" className="block text-sm font-medium text-[var(--foreground)] mb-1">
                Network (optional)
              </label>
              <input
                id="network"
                type="text"
                value={network}
                onChange={(e) => setNetwork(e.target.value)}
                placeholder="Visa, Mastercard, etc."
                className="surface-input w-full px-3 py-2.5"
              />
            </div>
            {error && (
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            )}
            <button
              type="submit"
              disabled={submitting}
              className="glow-button rounded-xl px-4 py-2.5 text-sm font-semibold disabled:opacity-50"
            >
              {submitting ? "…" : "Add card"}
            </button>
          </form>
        </GlassCard>

        <GlassCard className="p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-[var(--foreground)]">Card overview</h2>
            <span className="text-xs text-[var(--muted)]">{cardList.length} total</span>
          </div>
          <div className="mt-4 overflow-x-auto rounded-xl border border-[var(--border)]">
            <table className="min-w-full text-sm">
              <thead className="bg-[var(--glass)] text-[var(--muted)]">
                <tr>
                  <th className="px-3 py-2 text-left font-medium">Card</th>
                  <th className="px-3 py-2 text-left font-medium">Bank</th>
                  <th className="px-3 py-2 text-left font-medium">Network</th>
                  <th className="px-3 py-2 text-right font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {cardList.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-3 py-6 text-center text-[var(--muted)]">
                      No cards added yet.
                    </td>
                  </tr>
                ) : (
                  cardList.map((card) => (
                    <tr key={card.id} className="border-t border-[var(--border)]">
                      <td className="px-3 py-2.5 font-medium text-[var(--foreground)]">•••• {card.last4}</td>
                      <td className="px-3 py-2.5 text-[var(--foreground)]">{card.bankName || "—"}</td>
                      <td className="px-3 py-2.5 text-[var(--foreground)]">{card.network || "—"}</td>
                      <td className="px-3 py-2.5 text-right">
                        <button
                          type="button"
                          onClick={() => handleDelete(card.id)}
                          disabled={deletingId === card.id}
                          className="rounded-lg border border-red-300/80 bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-700 hover:bg-red-100 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {deletingId === card.id ? "Removing…" : "Remove"}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}

"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useFetch } from "@/hooks/useFetch";
import { cardsApi, transactionsApi, getApiErrorMessage } from "@/lib/api";
import { FileUpload } from "@/components/FileUpload";
import { LoadingState } from "@/components/Loader";
import { PageShell } from "@/components/ui/PageShell";

const BANKS = ["HDFC", "ICICI", "SBI", "Axis", "Kotak", "Yes Bank"];

export default function UploadPage() {
  const router = useRouter();
  const { data: cards = [], isLoading } = useFetch(
    () => cardsApi.list().then((r) => r.data),
    { deps: [] }
  );
  const [cardId, setCardId] = useState("");
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState<number | undefined>(undefined);
  const [error, setError] = useState("");

  const runUpload = useCallback(
    async (selectedCardId: string, file: File) => {
      setError("");
      setUploading(true);
      setProgress(40);
      try {
        const { data } = await transactionsApi.upload(selectedCardId, file);
        setProgress(100);
        router.push(
          `/dashboard/upload/processing?cardId=${encodeURIComponent(selectedCardId)}&imported=${data.imported}`
        );
      } catch (err: unknown) {
        setError(getApiErrorMessage(err, { context: "upload", defaultMessage: "Upload failed." }));
        setUploading(false);
        setProgress(undefined);
      }
    },
    [router]
  );

  async function handleFile(file: File) {
    if (!cardId) {
      setError("Select a card first.");
      return;
    }
    await runUpload(cardId, file);
  }

  if (isLoading) return <LoadingState title="Loading" />;

  const cardList = cards ?? [];

  return (
    <PageShell
      title="Statements"
      description="Upload a CSV or PDF bank statement to import transactions."
      actions={
        <Link
          href="/dashboard/transactions"
          className="rounded-xl border border-[var(--border)] px-4 py-2 text-sm font-medium hover:bg-[var(--surface-muted)]"
        >
          View transactions
        </Link>
      }
    >
      <div className="max-w-xl mx-auto space-y-6">
        <div className="content-card p-4">
          <label htmlFor="card" className="block text-sm font-medium mb-2">
            Card for this statement
          </label>
          <select
            id="card"
            value={cardId}
            onChange={(e) => {
              setCardId(e.target.value);
              setError("");
            }}
            className="surface-input w-full px-3 py-2.5"
          >
            <option value="">Select a card</option>
            {cardList.map((c) => (
              <option key={c.id} value={c.id}>
                •••• {c.last4}
                {c.bankName ? ` · ${c.bankName}` : ""}
              </option>
            ))}
          </select>
        </div>

        <div className="content-card p-8 text-center">
          <FileUpload
            accept=".csv,.pdf,application/pdf,text/csv"
            onFileSelect={handleFile}
            uploading={uploading}
            progress={progress}
            label="Drag & drop your statement here"
          />
          <p className="text-xs text-[var(--muted)] mt-4">
            Supports PDF and CSV from major Indian banks
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-3">
          {BANKS.map((bank) => (
            <span
              key={bank}
              className="rounded-lg border border-[var(--border)] bg-[var(--card)] px-3 py-1.5 text-xs font-medium text-[var(--muted)]"
            >
              {bank}
            </span>
          ))}
        </div>

        {error && <p className="text-sm text-red-600 text-center">{error}</p>}
        {cardList.length === 0 && (
          <p className="text-sm text-center text-[var(--muted)]">
            <Link href="/dashboard/cards" className="text-[var(--accent)] hover:underline">
              Add a card
            </Link>{" "}
            before uploading.
          </p>
        )}
      </div>
    </PageShell>
  );
}

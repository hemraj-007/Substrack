"use client";

import { useCallback, useState } from "react";
import { useFetch } from "@/hooks/useFetch";
import { cardsApi, transactionsApi, getApiErrorMessage } from "@/lib/api";
import { FileUpload } from "@/components/FileUpload";
import { GlassCard } from "@/components/GlassCard";
import { PageHeaderCard } from "@/components/PageHeaderCard";

export default function UploadPage() {
  const { data: cards = [], isLoading } = useFetch(
    () => cardsApi.list().then((r) => r.data),
    { deps: [] }
  );
  const [cardId, setCardId] = useState("");
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState<number | undefined>(undefined);
  const [result, setResult] = useState<number | null>(null);
  const [error, setError] = useState("");

  const runUpload = useCallback(async (selectedCardId: string, file: File) => {
    setError("");
    setResult(null);
    setUploading(true);
    setProgress(50);
    try {
      const { data } = await transactionsApi.upload(selectedCardId, file);
      setProgress(100);
      setResult(data.imported);
      setPendingFile(null);
    } catch (err: unknown) {
      setError(getApiErrorMessage(err, { context: "upload", defaultMessage: "Upload failed." }));
    } finally {
      setUploading(false);
      setProgress(undefined);
    }
  }, []);

  async function handleFile(file: File) {
    if (!cardId) {
      setPendingFile(file);
      setError("Select a card first.");
      return;
    }
    await runUpload(cardId, file);
  }

  function handleCardChange(nextCardId: string) {
    setCardId(nextCardId);
    if (!nextCardId) return;
    setError("");
    if (pendingFile) {
      const file = pendingFile;
      setPendingFile(null);
      void runUpload(nextCardId, file);
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="text-[var(--muted)]">Loading cards…</div>
      </div>
    );
  }

  const cardList = (cards ?? []) as { id: string; last4: string }[];

  return (
    <div className="space-y-6 sm:space-y-8">
      <PageHeaderCard
        variant="stacked"
        title="Upload transactions"
        description="Upload a CSV or PDF statement. Select the card these transactions belong to."
        showIdentifier={false}
        showDividers={false}
      />

      <GlassCard className="p-4 sm:p-6 max-w-xl w-full space-y-4">
        <div>
          <label htmlFor="card" className="block text-sm font-medium text-[var(--foreground)] mb-1">
            Card
          </label>
          <select
            id="card"
            value={cardId}
            onChange={(e) => handleCardChange(e.target.value)}
            className="surface-input w-full px-3 py-2.5"
          >
            <option value="">Select a card</option>
            {cardList.map((c) => (
              <option key={c.id} value={c.id}>•••• {c.last4}</option>
            ))}
          </select>
        </div>

        <FileUpload
          accept=".csv,.pdf,application/pdf,text/csv"
          onFileSelect={handleFile}
          uploading={uploading}
          progress={progress}
          label="Choose CSV or PDF file"
        />

        {error && (
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        )}
        {result != null && (
          <p className="text-sm text-emerald-600 dark:text-emerald-400">
            Imported {result} transaction(s).
          </p>
        )}
      </GlassCard>
    </div>
  );
}

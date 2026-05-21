"use client";

import { useRef, useState } from "react";

type FileUploadProps = {
  accept?: string;
  onFileSelect: (file: File) => void;
  uploading?: boolean;
  progress?: number;
  label?: string;
};

export function FileUpload({
  accept = ".csv",
  onFileSelect,
  uploading = false,
  progress,
  label = "Choose CSV file",
}: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  function handleFile(file: File | null) {
    if (!file) return;
    onFileSelect(file);
  }

  return (
    <div
      className={`rounded-xl sm:rounded-2xl border-2 border-dashed p-5 sm:p-8 text-center transition glass-card backdrop-blur-xl ${
        dragOver
          ? "border-[var(--accent)] bg-[var(--accent-subtle)]"
          : "border-[var(--border)] hover:border-[var(--accent)]/40"
      } ${uploading ? "pointer-events-none opacity-70" : ""}`}
      onDragOver={(e) => {
        e.preventDefault();
        setDragOver(true);
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragOver(false);
        const file = e.dataTransfer.files[0];
        handleFile(file ?? null);
      }}
      onClick={() => inputRef.current?.click()}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
      />
      {uploading ? (
        <div className="space-y-2">
          <p className="text-sm font-medium">Uploading…</p>
          {progress != null && (
            <div className="h-2 max-w-xs mx-auto rounded-full bg-[var(--border)] overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[var(--accent)] to-[var(--accent-2)] transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          )}
        </div>
      ) : (
        <p className="text-[var(--muted)]">
          {label} or drag and drop
        </p>
      )}
    </div>
  );
}

export function Loader({ className }: { className?: string }) {
  return (
    <div
      className={`inline-block h-6 w-6 animate-spin rounded-full border-2 border-[var(--border)] border-t-[var(--accent)] ${className ?? ""}`}
      aria-hidden
    />
  );
}

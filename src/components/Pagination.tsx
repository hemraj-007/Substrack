"use client";

type PaginationProps = {
  totalItems: number;
  pageSize: number;
  currentPage: number;
  onPageChange: (page: number) => void;
};

export function Pagination({
  totalItems,
  pageSize,
  currentPage,
  onPageChange,
}: PaginationProps) {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const start = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const end = Math.min(currentPage * pageSize, totalItems);

  if (totalPages <= 1 && totalItems <= pageSize) return null;

  return (
    <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center justify-between gap-3 pt-4">
      <p className="text-xs sm:text-sm text-[var(--muted)] order-2 sm:order-1">
        Showing {start}–{end} of {totalItems}
      </p>
      <div className="flex items-center justify-center sm:justify-end gap-2 order-1 sm:order-2">
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className="rounded-lg border border-[var(--border)] bg-[var(--glass)] px-3 py-2 min-h-[44px] text-sm font-medium text-[var(--foreground)] hover:bg-[var(--glass-hover)] disabled:opacity-50 disabled:pointer-events-none touch-manipulation"
        >
          Previous
        </button>
        <span className="text-xs sm:text-sm text-[var(--muted)] py-2">
          Page {currentPage} of {totalPages}
        </span>
        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="rounded-lg border border-[var(--border)] bg-[var(--glass)] px-3 py-2 min-h-[44px] text-sm font-medium text-[var(--foreground)] hover:bg-[var(--glass-hover)] disabled:opacity-50 disabled:pointer-events-none touch-manipulation"
        >
          Next
        </button>
      </div>
    </div>
  );
}

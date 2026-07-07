import type { ReactNode } from "react";

export type Column<T> = {
  key: string;
  header: string;
  cell: (row: T) => ReactNode;
  className?: string;
};

type Props<T> = {
  columns: Column<T>[];
  data: T[];
  keyFn: (row: T, index: number) => string;
  emptyMessage?: string;
};

export function DataTable<T>({ columns, data, keyFn, emptyMessage = "No data." }: Props<T>) {
  if (data.length === 0) {
    return (
      <div className="content-card p-8 text-center text-sm text-[var(--muted)]">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="content-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--border)] bg-[var(--surface-muted)]">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`text-left font-semibold text-[var(--muted)] px-4 py-3 whitespace-nowrap ${col.className ?? ""}`}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, i) => (
              <tr
                key={keyFn(row, i)}
                className="border-b border-[var(--border)] last:border-0 hover:bg-[var(--surface-muted)]/60 transition-colors"
              >
                {columns.map((col) => (
                  <td key={col.key} className={`px-4 py-3 text-[var(--foreground)] ${col.className ?? ""}`}>
                    {col.cell(row)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

import type { ReactNode } from "react";
import Link from "next/link";

type Props = {
  title: string;
  description?: string;
  action?: ReactNode;
  viewAllHref?: string;
  className?: string;
};

export function SectionHeader({
  title,
  description,
  action,
  viewAllHref,
  className = "",
}: Props) {
  return (
    <div className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4 ${className}`}>
      <div>
        <h2 className="text-lg font-semibold text-[var(--foreground)]">{title}</h2>
        {description && (
          <p className="text-sm text-[var(--muted)] mt-0.5">{description}</p>
        )}
      </div>
      <div className="flex items-center gap-3 shrink-0">
        {action}
        {viewAllHref && (
          <Link
            href={viewAllHref}
            className="text-sm font-medium text-[var(--accent)] hover:text-[var(--accent-hover)]"
          >
            View all →
          </Link>
        )}
      </div>
    </div>
  );
}

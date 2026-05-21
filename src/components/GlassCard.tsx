"use client";

import Link from "next/link";
import type { ReactNode } from "react";

type GlassCardProps = {
  children: ReactNode;
  className?: string;
};

export function GlassCard({ children, className = "" }: GlassCardProps) {
  return (
    <div className={`glass-card backdrop-blur-xl rounded-2xl ${className}`}>
      {children}
    </div>
  );
}

type CardHeaderProps = {
  title: string;
  viewAllHref?: string;
  viewAllLabel?: string;
};

export function CardHeader({
  title,
  viewAllHref,
  viewAllLabel = "View all",
}: CardHeaderProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2 mb-3 sm:mb-4">
      <h2 className="font-semibold tracking-wide text-[var(--foreground)] text-sm sm:text-base">{title}</h2>
      {viewAllHref && (
        <Link
          href={viewAllHref}
          className="text-xs sm:text-sm text-[var(--accent-hover)] hover:text-[var(--foreground)] font-medium transition min-h-[44px] flex items-center"
        >
          {viewAllLabel} →
        </Link>
      )}
    </div>
  );
}

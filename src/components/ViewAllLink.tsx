"use client";

import Link from "next/link";

type ViewAllLinkProps = {
  href: string;
  children?: React.ReactNode;
};

export function ViewAllLink({ href, children = "View all" }: ViewAllLinkProps) {
  return (
    <Link
      href={href}
      className="text-sm text-[var(--accent)] hover:underline font-medium"
    >
      {children} →
    </Link>
  );
}

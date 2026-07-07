import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
  hover?: boolean;
};

export function DashCard({ children, className = "", hover = true }: Props) {
  return (
    <div className={`dash-card ${hover ? "dash-card-hover" : ""} ${className}`}>{children}</div>
  );
}

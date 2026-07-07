import type { NavIcons } from "./navIcons";

export type NavItem = {
  href: string;
  label: string;
  icon: keyof typeof NavIcons;
  /** Shown in bottom nav on mobile (max ~5 items) */
  mobile?: boolean;
};

export const MAIN_NAV: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: "dashboard", mobile: true },
  { href: "/dashboard/upload", label: "Statements", icon: "statements", mobile: true },
  { href: "/dashboard/subscriptions", label: "Subscriptions", icon: "subscriptions", mobile: true },
  { href: "/dashboard/renewals", label: "Renewals", icon: "renewals" },
  { href: "/dashboard/analytics", label: "Analytics", icon: "analytics" },
  { href: "/dashboard/insights", label: "AI Insights", icon: "insights" },
  { href: "/dashboard/cards", label: "Cards", icon: "cards", mobile: true },
  { href: "/dashboard/transactions", label: "Transactions", icon: "transactions" },
  { href: "/dashboard/alerts", label: "Alerts", icon: "alerts", mobile: true },
  { href: "/dashboard/settings", label: "Settings", icon: "settings" },
];

export const MOBILE_NAV = MAIN_NAV.filter((item) => item.mobile);

export function isNavActive(pathname: string, href: string): boolean {
  if (href === "/dashboard") return pathname === "/dashboard";
  return pathname === href || pathname.startsWith(`${href}/`);
}

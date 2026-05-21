import { DashboardShell } from "@/components/DashboardShell";

export default function HomeLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <DashboardShell>{children}</DashboardShell>;
}

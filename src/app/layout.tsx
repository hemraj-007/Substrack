import type { Metadata } from "next";
import "@/styles/globals.css";
import { Providers } from "@/components/Providers";
import { Outfit } from "next/font/google";

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Subscription Guardian",
  description: "Track cards, transactions, and recurring subscriptions with renewal and unused alerts.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${outfit.variable} antialiased min-h-screen bg-[var(--background)] text-[var(--foreground)]`}
        suppressHydrationWarning
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

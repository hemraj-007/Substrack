"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { subscriptionsApi } from "@/lib/api";

const STEPS = [
  "Reading your statement",
  "Detecting transactions",
  "Identifying subscriptions",
  "Finding renewals",
  "Building insights",
];

export default function ProcessingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const imported = Number(searchParams.get("imported") ?? 0);
  const [stepIndex, setStepIndex] = useState(0);
  const [done, setDone] = useState(false);
  const [detectCount, setDetectCount] = useState(0);

  useEffect(() => {
    let cancelled = false;
    const timers: ReturnType<typeof setTimeout>[] = [];

    async function run() {
      for (let i = 0; i < STEPS.length; i++) {
        await new Promise<void>((resolve) => {
          const t = setTimeout(() => {
            if (!cancelled) setStepIndex(i);
            resolve();
          }, 600);
          timers.push(t);
        });
      }

      try {
        const { data } = await subscriptionsApi.detect();
        if (!cancelled) setDetectCount(Array.isArray(data) ? data.length : 0);
      } catch {
        /* best-effort */
      }

      if (!cancelled) {
        setDone(true);
        const t = setTimeout(() => router.replace("/dashboard"), 2000);
        timers.push(t);
      }
    }

    void run();
    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
    };
  }, [router]);

  return (
    <div className="max-w-md mx-auto py-12">
      <div className="content-card p-8 text-center">
        <h1 className="text-xl font-bold text-[var(--foreground)]">
          {done ? "All set!" : "Analyzing your statement"}
        </h1>
        <p className="text-sm text-[var(--muted)] mt-2">
          {done
            ? `Imported ${imported} transactions and detected ${detectCount} subscriptions.`
            : "This usually takes a few seconds…"}
        </p>

        <ul className="mt-8 space-y-3 text-left">
          {STEPS.map((label, i) => {
            const complete = done || i < stepIndex;
            const active = !done && i === stepIndex;
            return (
              <li key={label} className="flex items-center gap-3 text-sm">
                <span
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                    complete
                      ? "bg-emerald-500 text-white"
                      : active
                        ? "bg-[var(--accent)] text-white animate-pulse"
                        : "bg-[var(--surface-muted)] text-[var(--muted)]"
                  }`}
                >
                  {complete ? "✓" : i + 1}
                </span>
                <span
                  className={
                    complete || active ? "text-[var(--foreground)]" : "text-[var(--muted)]"
                  }
                >
                  {label}
                </span>
              </li>
            );
          })}
        </ul>

        {done && (
          <Link
            href="/dashboard"
            className="inline-block mt-8 text-sm font-medium text-[var(--accent)] hover:underline"
          >
            Go to dashboard →
          </Link>
        )}
      </div>
    </div>
  );
}

"use client";

import { useCallback, useEffect, useState } from "react";

type Status = "idle" | "loading" | "success" | "error";

function isUnauthorized(err: unknown): boolean {
  if (err && typeof err === "object" && "response" in err) {
    const res = (err as { response?: { status?: number } }).response;
    return res?.status === 401 || res?.status === 403;
  }
  return false;
}

export function useFetch<T>(
  fetcher: () => Promise<T>,
  options?: { enabled?: boolean; deps?: unknown[] }
) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const enabled = options?.enabled !== false;
  const deps = options?.deps ?? [];

  const refetch = useCallback(async () => {
    setStatus("loading");
    setError(null);
    try {
      const result = await fetcher();
      setData(result);
      setStatus("success");
      return result;
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
      setStatus("error");
      // Never re-throw: callers should use isError/error (avoids Next.js error overlay).
      return undefined as T;
    }
  }, [fetcher]);

  useEffect(() => {
    if (enabled) {
      refetch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, ...deps]);

  return {
    data,
    error,
    status,
    isLoading: status === "loading",
    isError: status === "error",
    isSuccess: status === "success",
    refetch,
  };
}

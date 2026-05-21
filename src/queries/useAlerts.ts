"use client";

import { useQuery } from "@tanstack/react-query";
import { alertsApi } from "@/lib/api";

const keys = {
  all: ["alerts"] as const,
};

export function useAlerts() {
  return useQuery({
    queryKey: keys.all,
    queryFn: () => alertsApi.list().then((r) => r.data),
  });
}

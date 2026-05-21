"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { subscriptionsApi } from "@/lib/api";

const keys = {
  all: ["subscriptions"] as const,
};

export function useSubscriptions() {
  return useQuery({
    queryKey: keys.all,
    queryFn: () => subscriptionsApi.list().then((r) => r.data),
  });
}

export function useDetectSubscriptions() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => subscriptionsApi.detect().then((r) => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: keys.all });
    },
  });
}

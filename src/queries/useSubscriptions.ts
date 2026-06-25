"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { subscriptionsApi } from "@/lib/api";
import { useCardFilterParams, useCardFilterQueryKey } from "@/hooks/useCardFilter";

const keys = {
  all: (cardKey: string) => ["subscriptions", cardKey] as const,
  summary: (cardKey: string) => ["subscriptions", "summary", cardKey] as const,
};

export function useSubscriptions() {
  const cardKey = useCardFilterQueryKey();
  const params = useCardFilterParams();
  return useQuery({
    queryKey: keys.all(cardKey),
    queryFn: () => subscriptionsApi.list(params).then((r) => r.data),
  });
}

export function useSubscriptionSummary() {
  const cardKey = useCardFilterQueryKey();
  const params = useCardFilterParams();
  return useQuery({
    queryKey: keys.summary(cardKey),
    queryFn: () => subscriptionsApi.summary(params).then((r) => r.data),
  });
}

export function useDetectSubscriptions() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => subscriptionsApi.detect().then((r) => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subscriptions"] });
    },
  });
}

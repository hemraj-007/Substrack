"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { cardsApi, type CardPayload } from "@/lib/api";

const keys = {
  all: ["cards"] as const,
};

export function useCards() {
  return useQuery({
    queryKey: keys.all,
    queryFn: () => cardsApi.list().then((r) => r.data),
  });
}

export function useCreateCard() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CardPayload) => cardsApi.create(data).then((r) => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: keys.all });
    },
  });
}

export function useDeleteCard() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => cardsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: keys.all });
    },
  });
}

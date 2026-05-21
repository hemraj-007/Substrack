"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { transactionsApi } from "@/lib/api";

const keys = {
  all: ["transactions"] as const,
};

export function useTransactions() {
  return useQuery({
    queryKey: keys.all,
    queryFn: () => transactionsApi.list().then((r) => r.data),
  });
}

type UploadVariables = { cardId: string; file: File };

export function useUploadTransactions() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ cardId, file }: UploadVariables) =>
      transactionsApi.upload(cardId, file).then((r) => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: keys.all });
      queryClient.invalidateQueries({ queryKey: ["subscriptions"] });
    },
  });
}

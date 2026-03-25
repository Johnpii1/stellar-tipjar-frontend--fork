import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTipIntent } from "@/services/api";
import { tipKeys } from "@/hooks/queries/useTips";

interface SendTipPayload {
  username: string;
  amount: string;
  assetCode: string;
}

export function useSendTip() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: SendTipPayload) => createTipIntent(payload),
    onSuccess: () => {
      // Invalidate tip list so it refetches with the new tip
      queryClient.invalidateQueries({ queryKey: tipKeys.all });
    },
  });
}

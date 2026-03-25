import { useQuery } from "@tanstack/react-query";

export interface Tip {
  id: string;
  date: string;
  amount: number;
  recipient: string;
  sender: string;
  status: "completed" | "pending" | "failed";
  transactionHash?: string;
  memo?: string;
}

export const tipKeys = {
  all: ["tips"] as const,
};

// Reuses the mock data from useTipHistory — swap fetchFn for a real API call when ready.
async function fetchTips(): Promise<Tip[]> {
  await new Promise((r) => setTimeout(r, 500));
  return [
    { id: "1", date: "2024-03-20T10:30:00Z", amount: 50, recipient: "alice", sender: "you", status: "completed", transactionHash: "abc123", memo: "Great content!" },
    { id: "2", date: "2024-03-19T15:45:00Z", amount: 25, recipient: "stellar-dev", sender: "you", status: "completed", transactionHash: "def456" },
    { id: "3", date: "2024-03-18T09:15:00Z", amount: 100, recipient: "pixelmaker", sender: "you", status: "pending" },
    { id: "4", date: "2024-03-17T14:20:00Z", amount: 15, recipient: "crypto-artist", sender: "you", status: "completed", transactionHash: "ghi789" },
    { id: "5", date: "2024-03-16T11:00:00Z", amount: 75, recipient: "blockchain-edu", sender: "you", status: "failed" },
    { id: "6", date: "2024-03-15T16:30:00Z", amount: 30, recipient: "community-lab", sender: "you", status: "completed", transactionHash: "jkl012" },
    { id: "7", date: "2024-03-14T13:45:00Z", amount: 200, recipient: "nft-creator", sender: "you", status: "completed", transactionHash: "mno345", memo: "Amazing work!" },
    { id: "8", date: "2024-03-13T10:10:00Z", amount: 45, recipient: "defi-expert", sender: "you", status: "completed", transactionHash: "pqr678" },
  ];
}

export function useTips() {
  return useQuery({
    queryKey: tipKeys.all,
    queryFn: fetchTips,
    staleTime: 60 * 1000, // 1 minute — tips change more frequently
  });
}

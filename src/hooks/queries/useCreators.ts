import { useQuery } from "@tanstack/react-query";
import { getCreatorProfile } from "@/services/api";

export const creatorKeys = {
  profile: (username: string) => ["creators", username] as const,
};

export function useCreatorProfile(username: string) {
  return useQuery({
    queryKey: creatorKeys.profile(username),
    queryFn: () => getCreatorProfile(username),
    staleTime: 5 * 60 * 1000,
    enabled: !!username,
  });
}

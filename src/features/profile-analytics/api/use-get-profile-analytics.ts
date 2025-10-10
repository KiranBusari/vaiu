import { client } from "@/lib/rpc";
import { useQuery } from "@tanstack/react-query";
import { InferResponseType } from "hono";

type ResponseType = InferResponseType<
  (typeof client.api.v1)["profile-analytics"][":username"]["$get"]
>;

interface UseGetProfileAnalyticsProps {
  username: string;
}

export const useGetProfileAnalytics = ({
  username
}: UseGetProfileAnalyticsProps) => {
  const query = useQuery({
    queryKey: ["profile-analytics", username],
    queryFn: async () => {
      const response = await client.api.v1["profile-analytics"][":username"].$get({
        param: { username },
      });
      
      if (!response.ok) {
        throw new Error("Failed to fetch profile analytics");
      }

      return await response.json();
    },
    enabled: !!username,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  });

  return query;
};
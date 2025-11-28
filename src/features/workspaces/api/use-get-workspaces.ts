import { client } from "@/lib/rpc";
import { useQuery } from "@tanstack/react-query";

export const useGetWorkspaces = () => {
  const query = useQuery({
    queryKey: ["workspaces"],
    queryFn: async () => {
      const response = await client.api.v1.workspaces.$get();
      if (!response.ok) {
        throw new Error("Failed to get workspaces");
      }
      const { data } = await response.json();
      return data;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes - workspaces rarely change
    gcTime: 15 * 60 * 1000, // 15 minutes cache
    refetchOnWindowFocus: false,
  });

  return query;
};

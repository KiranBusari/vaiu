import { client } from "@/lib/rpc";
import { useQuery } from "@tanstack/react-query";

interface useGetWorkspaceProps {
  workspaceId: string;
}
export const useGetWorkspace = ({ workspaceId }: useGetWorkspaceProps) => {
  const query = useQuery({
    queryKey: ["workspace", workspaceId],
    queryFn: async () => {
      const response = await client.api.v1.workspaces[":workspaceId"].$get({
        param: { workspaceId },
      });
      if (!response.ok) {
        throw new Error("Failed to get workspace");
      }
      const { data } = await response.json();
      return data;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes cache
    refetchOnWindowFocus: false,
  });

  return query;
};

import { client } from "@/lib/rpc";
import { useQuery } from "@tanstack/react-query";

interface UseGetWorkspaceJoinInfo {
  workspaceId: string;
}

export const useGetWorkspaceJoinInfo = ({
  workspaceId,
}: UseGetWorkspaceJoinInfo) => {
  const query = useQuery({
    queryKey: ["workspace-join-info", workspaceId],
    queryFn: async () => {
      const response = await client.api.v1.workspaces[":workspaceId"][
        "join"
      ].$get({
        param: { workspaceId },
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("Workspace not found");
        }
        throw new Error("Failed to get workspace info");
      }

      const { data } = await response.json();
      return data;
    },
  });

  return query;
};

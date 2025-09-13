import { client } from "@/lib/rpc";
import { useQuery } from "@tanstack/react-query";

interface useGetPullRequestsProps {
  workspaceId: string;
  projectId: string;
}
export const useGetPullRequests = ({
  workspaceId,
  projectId,
}: useGetPullRequestsProps) => {
  const query = useQuery({
    queryKey: [
      "pull-requests",
      workspaceId,
      projectId,
    ],
    queryFn: async () => {
      const response = await client.api.v1["pull-requests"].$get({
        query: {
          workspaceId,
          projectId,
        },
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          "error" in errorData ? errorData.error : "Failed to fetch pull requests",
        );
      }
      const { data } = await response.json();
      return data;
    },
  });

  return query;
};

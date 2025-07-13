import { client } from "@/lib/rpc";
import { useQuery } from "@tanstack/react-query";
interface UseGetMembersProps {
  workspaceId: string;
  projectId: string;
}
export const useGetProjectMembers = ({
  workspaceId,
  projectId,
}: UseGetMembersProps) => {
  const query = useQuery({
    queryKey: ["members", workspaceId, projectId],
    queryFn: async () => {
      const response = await client.api.v1.members["projectMembers"].$get({
        query: { workspaceId, projectId },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          "error" in errorData ? errorData.error : "Failed to login",
        );
      }
      const { data } = await response.json();
      return data;
    },
  });

  return query;
};

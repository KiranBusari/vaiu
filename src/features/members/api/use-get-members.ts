import { client } from "@/lib/rpc";
import { useQuery } from "@tanstack/react-query";
interface UseGetMembersProps {
  workspaceId: string;
}
export const useGetMembers = ({ workspaceId }: UseGetMembersProps) => {
  const query = useQuery({
    queryKey: ["members", workspaceId],
    queryFn: async () => {
      const response = await client.api.v1.members.$get({
        query: { workspaceId },
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

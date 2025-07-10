import { client } from "@/lib/rpc";
import { useQuery } from "@tanstack/react-query";

interface useGetProjectsProps {
  workspaceId: string;
}
export const useGetSpecificProjects = ({
  workspaceId,
}: useGetProjectsProps) => {
  const query = useQuery({
    queryKey: ["projects", workspaceId],
    queryFn: async () => {
      const response = await client.api.v1.projects["get-projects"].$get({
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

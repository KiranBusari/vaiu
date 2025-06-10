import { client } from "@/lib/rpc";
import { useQuery } from "@tanstack/react-query";

interface useGetProjectInfo {
  projectId: string;
}
export const useGetProjectInfo = ({ projectId }: useGetProjectInfo) => {
  const query = useQuery({
    queryKey: ["project-info", projectId],
    queryFn: async () => {
      const response = await client.api.v1.projects[":projectId"][
        "info"
      ].$get({
        param: { projectId },
      });
      if (!response.ok) {
        throw new Error("Failed to get project info");
      }
      const { data } = await response.json();
      return data;
    },
  });

  return query;
};

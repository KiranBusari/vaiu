import { client } from "@/lib/rpc";
import { useQuery } from "@tanstack/react-query";

interface useGetProjectProps {
  projectId: string;
}
export const useGetProject = ({ projectId }: useGetProjectProps) => {
  const query = useQuery({
    queryKey: ["project", projectId],
    queryFn: async () => {
      const response = await client.api.v1.projects[":projectId"].$get({
        param: { projectId },
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
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes cache
    refetchOnWindowFocus: false,
  });

  return query;
};

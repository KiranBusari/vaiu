import { client } from "@/lib/rpc";
import { useQuery } from "@tanstack/react-query";
import { InferResponseType } from "hono";

interface UseGetProjectAnalyticsProps {
  projectId: string;
}
export type ProjectAnalyticsResponseType = InferResponseType<
  (typeof client.api.v1.projects)[":projectId"]["analytics"]["$get"],
  200
>;
export const useGetProjectAnalytics = ({
  projectId,
}: UseGetProjectAnalyticsProps) => {
  const query = useQuery({
    queryKey: ["project-analytics", projectId],
    queryFn: async () => {
      const response = await client.api.v1.projects[
        ":projectId"
      ].analytics.$get({
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
  });

  return query;
};

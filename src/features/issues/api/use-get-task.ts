import { client } from "@/lib/rpc";
import { useQuery } from "@tanstack/react-query";

interface useGetIssueProps {
  issueId: string;
  enabled?: boolean;
}
export const useGetTask = ({ issueId, enabled = true }: useGetIssueProps) => {
  const query = useQuery({
    queryKey: ["issue", issueId],
    queryFn: async () => {
      const response = await client.api.v1.issues[":issueId"].$get({
        param: { issueId },
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          "error" in errorData ? errorData.error : "Failed to fetch issue",
        );
      }
      const { data } = await response.json();

      return data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes - issues don't change that often
    gcTime: 10 * 60 * 1000, // 10 minutes - keep in cache longer
    refetchOnWindowFocus: false, // Don't refetch on window focus/page reload
    enabled, // Only fetch when enabled
  });

  return query;
};

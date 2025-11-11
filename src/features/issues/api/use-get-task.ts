import { client } from "@/lib/rpc";
import { useQuery } from "@tanstack/react-query";

interface useGetIssueProps {
  issueId: string;
}
export const useGetTask = ({ issueId }: useGetIssueProps) => {
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
  });

  return query;
};

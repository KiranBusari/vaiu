import { client } from "@/lib/rpc";
import { useQuery } from "@tanstack/react-query";

interface useGetTaskProps {
  issueId: string;
}
export const useGetTask = ({ issueId }: useGetTaskProps) => {
  const query = useQuery({
    queryKey: ["issue", issueId],
    queryFn: async () => {
      const response = await client.api.v1.issues[":issueId"].$get({
        param: { issueId },
      });
      if (!response.ok) {
        throw new Error("Failed to get issue");
      }
      const { data } = await response.json();

      return data;
    },
  });

  return query;
};

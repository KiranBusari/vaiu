import { client } from "@/lib/rpc";
import { useQuery } from "@tanstack/react-query";

export const useGetIssueComments = ({ issueId }: { issueId: string }) => {
    const query = useQuery({
        queryKey: ["issue-comments", issueId],
        queryFn: async () => {
            const response = await client.api.v1.issues[":issueId"].comments.$get({
                param: { issueId },
            });

            if (!response.ok) {
                throw new Error("Failed to get issue comments");
            }

            const { data } = await response.json();
            return data;
        },
    });

    return query;
};

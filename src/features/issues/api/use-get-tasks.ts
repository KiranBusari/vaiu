import { client } from "@/lib/rpc";
import { useQuery } from "@tanstack/react-query";
import { IssueStatus } from "../types";

interface useGetIssuesProps {
  workspaceId: string;
  projectId?: string | null;
  status?: IssueStatus | null;
  assigneeId?: string | null;
  dueDate?: string | null;
  search?: string | null;
}
export const useGetIssues = ({
  workspaceId,
  assigneeId,
  projectId,
  dueDate,
  search,
  status,
}: useGetIssuesProps) => {
  const query = useQuery({
    queryKey: [
      "issues",
      workspaceId,
      projectId,
      status,
      search,
      assigneeId,
      dueDate,
    ],
    queryFn: async () => {
      const response = await client.api.v1.issues.$get({
        query: {
          workspaceId,
          projectId: projectId ?? undefined,
          status: status ?? undefined,
          search: search ?? undefined,
          assigneeId: assigneeId ?? undefined,
          dueDate: dueDate ?? undefined,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to get issues");
      }
      const { data } = await response.json();
      // console.log("Data", data);

      return data;
    },
  });

  return query;
};

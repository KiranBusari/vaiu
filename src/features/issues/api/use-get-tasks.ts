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
  enabled?: boolean;
}
export const useGetIssues = ({
  workspaceId,
  assigneeId,
  projectId,
  dueDate,
  search,
  status,
  enabled = true,
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
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          "error" in errorData ? errorData.error : "Failed to login",
        );
      }
      const { data } = await response.json();

      return data;
    },
    enabled,
  });

  return query;
};

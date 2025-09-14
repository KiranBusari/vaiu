import { useMutation, useQueryClient } from "@tanstack/react-query";
import { client } from "@/lib/rpc";
import { InferRequestType } from "hono";
import { toast } from "sonner";

interface CommentResponse {
  data: {
    $id: string;
  }
}

type RequestType = InferRequestType<(typeof client.api.v1.issues[":issueId"]["comments"])["$post"]>;

export const useCreateIssueComment = (issueId: string) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<CommentResponse, Error, RequestType>({
    mutationFn: async ({ json }): Promise<CommentResponse> => {
      const response = await client.api.v1.issues[":issueId"].comments.$post({
        param: { issueId },
        json,
      });
      if (!response.ok) throw new Error("Failed to create comment");
      return (await response.json()) as CommentResponse;
    },
    onSuccess: () => {
      toast.success("Comment added successfully");
      queryClient.invalidateQueries({ queryKey: ["issue-comments", issueId] });
    },
    onError: (e) => {
      toast.error(e.message || "Failed to create comment");
    }
  });

  return mutation;
};

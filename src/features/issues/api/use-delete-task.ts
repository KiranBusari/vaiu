import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/lib/rpc";
import { toast } from "sonner";

type ResponseType = InferResponseType<
  (typeof client.api.v1.issues)[":issueId"]["$delete"],
  200
>;
type RequestType = InferRequestType<
  (typeof client.api.v1.issues)[":issueId"]["$delete"]
>;

export const useDeleteTask = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ param }) => {
      const response = await client.api.v1.issues[":issueId"].$delete({
        param,
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          "error" in errorData ? errorData.error : "Failed to delete issue",
        );
      }
      return await response.json();
    },
    onSuccess: ({ data }) => {
      toast.success("Issue deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["issues"] });
      queryClient.invalidateQueries({ queryKey: ["issue", data.$id] });
    },
    onError: (e) => {
      toast.error(e.message || "Failed to delete issue");
    },
  });

  return mutation;
};

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/lib/rpc";
import { toast } from "sonner";

type ResponseType = InferResponseType<
  (typeof client.api.v1.issues)[":issueId"]["$patch"],
  200
>;
type RequestType = InferRequestType<
  (typeof client.api.v1.issues)[":issueId"]["$patch"]
>;

export const useUpdateTask = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json, param }) => {
      const response = await client.api.v1.issues[":issueId"].$patch({
        json,
        param,
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage =
          "error" in errorData ? errorData.error : "Failed to update issue";

        // Create error with status information
        const error = new Error(errorMessage) as Error & { status: number };
        error.status = response.status;
        throw error;
      }
      return await response.json();
    },
    onSuccess: ({ data }) => {
      toast.success("Issue updated successfully");
      queryClient.invalidateQueries({ queryKey: ["issues"] });
      queryClient.invalidateQueries({ queryKey: ["issue", data.$id] });
    },

    onError: (error: Error & { status?: number }) => {
      if (error.status === 403) {
        toast.error("Only Admin can move issue to Done");
      } else {
        toast.error(error.message || "Failed to update issue");
      }
    },
  });

  return mutation;
};

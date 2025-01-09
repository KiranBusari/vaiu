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
      if (!response.ok) throw new Error("Failed to create task");
      return await response.json();
    },
    onSuccess: ({ data }) => {
      toast.success("Task deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["issues"] });
      queryClient.invalidateQueries({ queryKey: ["issue", data.$id] });
    },
    onError: () => {
      toast.error("Failed to delete task");
    },
  });

  return mutation;
};

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/lib/rpc";
import { toast } from "sonner";

type ResponseType = InferResponseType<
  (typeof client.api.v1.issues)["bulk-update"]["$post"],
  200
>;
type RequestType = InferRequestType<
  (typeof client.api.v1.issues)["bulk-update"]["$post"]
>;

export const useBulkUpdateTasks = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json }) => {
      const response = await client.api.v1.issues["bulk-update"].$post({
        json,
      });

      if (!response.ok) throw new Error("Failed to bulk-update issue");
      return await response.json();
    },
    onSuccess: () => {
      toast.success("Tasks updated successfully");
      queryClient.invalidateQueries({ queryKey: ["issues"] });
    },
    onError: () => {
      toast.error("Failed to update issues");
    },
  });
  return mutation;
};

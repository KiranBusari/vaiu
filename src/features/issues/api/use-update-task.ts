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
      if (!response.ok) throw new Error("Failed to update Issue");
      return await response.json();
    },
    onSuccess: ({ data }) => {
      toast.success("Issue updated successfully");
      queryClient.invalidateQueries({ queryKey: ["issues"] });
      queryClient.invalidateQueries({ queryKey: ["issue", data.$id] });
    },
    onError: () => {
      toast.error("Failed to update issue");
    },
  });

  return mutation;
};

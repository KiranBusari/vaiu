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

type ErrorResponse = {
  error?: string;
};

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

    // TODO: Fix Toast Error
    onError: (error: unknown) => {
      if (
        error &&
        typeof error === "object" &&
        "status" in error &&
        (error as Response).status === 403 &&
        typeof (error as Response).json === "function"
      ) {
        (error as Response).json().then((body: ErrorResponse) => {
          toast.error(body?.error || "Only Admin can move issue to Done");
        }).catch(() => {
          toast.error("Only Admin can move issue to Done");
        });
      } else {
        toast.error("Failed to update issue");
      }
    },
  });

  return mutation;
};

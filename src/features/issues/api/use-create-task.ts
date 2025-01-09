import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/lib/rpc";
import { toast } from "sonner";

type ResponseType = InferResponseType<
  (typeof client.api.v1.issues)["$post"],
  200
>;
type RequestType = InferRequestType<(typeof client.api.v1.issues)["$post"]>;

export const useCreateTask = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json }) => {
      const response = await client.api.v1.issues.$post({ json });
      if (!response.ok) throw new Error("Failed to create task");
      return (await response.json()) as ResponseType;
    },
    onSuccess: () => {
      toast.success("Task created successfully");
      queryClient.invalidateQueries({ queryKey: ["issues"] });
    },
    onError: () => {
      toast.error("Failed to create task");
    },
  });

  return mutation;
};

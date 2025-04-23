import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { client } from "@/lib/rpc";
import { toast } from "sonner";

type ResponseType = InferResponseType<
  (typeof client.api.v1.issues)["fetch-issues"]["$post"],
  200
>;

type RequestType = InferRequestType<
  (typeof client.api.v1.issues)["fetch-issues"]["$post"]
>;

export const useFetchIssues = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json }): Promise<ResponseType> => {
      const response = await client.api.v1.issues["fetch-issues"].$post({
        json,
      });

      if (!response.ok) throw new Error("Failed to fetch issues");

      return (await response.json()) as ResponseType;
    },
    onSuccess: () => {
      toast.success("Issues fetched successfully");

      queryClient.invalidateQueries({ queryKey: ["issues"] });
    },
    onError: () => {
      toast.error("Failed to fetch issues");
    },
  });
  return mutation;
};

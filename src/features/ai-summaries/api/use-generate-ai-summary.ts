import { client } from "@/lib/rpc";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

type ResponseType = InferResponseType<
  (typeof client.api.v1)["ai-summaries"]["generate"]["$post"]
>;
type RequestType = InferRequestType<
  (typeof client.api.v1)["ai-summaries"]["generate"]["$post"]
>;

export const useGenerateAISummary = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json }) => {
      const response = await client.api.v1["ai-summaries"]["generate"]["$post"]({
        json,
      });

      if (!response.ok) {
        throw new Error("Failed to generate AI summary");
      }

      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["ai-summaries"],
      });
    },
  });

  return mutation;
};
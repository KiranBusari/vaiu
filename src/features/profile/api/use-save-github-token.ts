import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";

import { client } from "@/lib/rpc";

type ResponseType = InferResponseType<
  (typeof client.api.v1.profile)["github-token"]["$post"],
  200
>;
type RequestType = InferRequestType<
  (typeof client.api.v1.profile)["github-token"]["$post"]
>;

export const useSaveGithubToken = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json }) => {
      const response = await client.api.v1.profile["github-token"].$post({
        json,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          "error" in errorData ? errorData.error : "Failed to save GitHub token"
        );
      }

      return await response.json();
    },
    onSuccess: () => {
      toast.success("GitHub token saved successfully");
      queryClient.invalidateQueries({ queryKey: ["github-token"] });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to save GitHub token");
    },
  });

  return mutation;
};

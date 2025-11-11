import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferResponseType } from "hono";
import { toast } from "sonner";

import { client } from "@/lib/rpc";

type ResponseType = InferResponseType<
  (typeof client.api.v1.profile)["github-token"]["$delete"],
  200
>;

export const useDeleteGithubToken = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error>({
    mutationFn: async () => {
      const response = await client.api.v1.profile["github-token"].$delete();

      if (!response.ok) {
        throw new Error("Failed to delete GitHub token");
      }

      return await response.json();
    },
    onSuccess: () => {
      toast.success("GitHub token deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["github-token"] });
    },
    onError: () => {
      toast.error("Failed to delete GitHub token");
    },
  });

  return mutation;
};

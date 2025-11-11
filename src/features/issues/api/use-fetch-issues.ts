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

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          "error" in errorData ? errorData.error : "Failed to sync issues",
        );
      }
      return (await response.json()) as ResponseType;
    },
    onSuccess: (data) => {
      const summary = data.summary;
      if (summary) {
        const { newIssues, updatedIssues } = summary;
        if (newIssues === 0 && updatedIssues === 0) {
          toast.success("Already in sync with GitHub");
        } else {
          toast.success(
            `Synced successfully! ${newIssues} new, ${updatedIssues} updated`
          );
        }
      } else {
        toast.success("Issues synced successfully");
      }

      queryClient.invalidateQueries({ queryKey: ["issues"] });
    },
    onError: (e) => {
      toast.error(e.message || "Failed to sync issues");
    },
  });
  return mutation;
};

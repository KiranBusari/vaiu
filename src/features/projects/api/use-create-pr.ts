import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/lib/rpc";
import { toast } from "sonner";

type ResponseType = InferResponseType<
  (typeof client.api.v1.projects)[":projectId"]["submit-pull-request"]["$post"],
  200
>;
type RequestType = InferRequestType<
  (typeof client.api.v1.projects)[":projectId"]["submit-pull-request"]["$post"]
>;

export const useCreatePr = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ param, form }) => {
      const response = await client.api.v1.projects[":projectId"][
        "submit-pull-request"
      ].$post({
        param,
        form,
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          "error" in errorData ? errorData.error : "Failed to login",
        );
      }
      return await response.json();
    },
    onSuccess: () => {
      toast.success("PR created successfully");
      queryClient.invalidateQueries({ queryKey: ["submit-pull-request"] });
    },
    onError: (e) => {
      toast.error(e.message || "Failed to create PR");
    },
  });

  return mutation;
};

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/lib/rpc";
import { toast } from "sonner";

type ResponseType = InferResponseType<
  (typeof client.api.v1.projects)["add-existing-project"]["$post"],
  200
>;
type RequestType = InferRequestType<
  (typeof client.api.v1.projects)["add-existing-project"]["$post"]
>;

export const useAddExistingProject = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ form }) => {
      const response = await client.api.v1.projects[
        "add-existing-project"
      ].$post({ form });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          "error" in errorData ? errorData.error : "Failed to create project",
        );
      }
      return await response.json();
    },
    onSuccess: () => {
      toast.success("Project created successfully");
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
    onError: (e) => {
      toast.error(e.message || "Failed to create project");
    },
  });

  return mutation;
};

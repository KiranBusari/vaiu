import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/lib/rpc";
import { toast } from "sonner";

type ResponseType = InferResponseType<
  (typeof client.api.v1.projects)[":projectId"]["addCollaborator"]["$post"],
  200
>;
type RequestType = InferRequestType<
  (typeof client.api.v1.projects)[":projectId"]["addCollaborator"]["$post"]
>;

export const useAddCollaboratorToProject = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json }) => {
      const response = await client.api.v1.projects[":projectId"][
        "addCollaborator"
      ].$post({ json, param: { projectId: json.projectId } });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          "error" in errorData ? errorData.error : "Failed to add collaborator",
        );
      }
      return (await response.json()) as ResponseType;
    },
    onSuccess: () => {
      toast.success("Collaborator added successfully");
      queryClient.invalidateQueries({ queryKey: ["collaborators"] });
    },
    onError: (e) => {
      toast.error(e.message || "Failed to add collaborator");
    },
  });

  return mutation;
};

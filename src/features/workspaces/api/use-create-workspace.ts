import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType } from "hono";

import { client } from "@/lib/rpc";
import { toast } from "sonner";

interface WorkspaceResponse {
  data: {
    $id: string;
  };
}

type RequestType = InferRequestType<(typeof client.api.v1.workspaces)["$post"]>;

export const useCreateWorkspace = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation<WorkspaceResponse, Error, RequestType>({
    mutationFn: async ({ form }): Promise<WorkspaceResponse> => {
      const response = await client.api.v1.workspaces.$post({ form });
      if (!response.ok) throw new Error("Failed to create workspace");
      return (await response.json()) as WorkspaceResponse;
    },
    onSuccess: () => {
      toast.success("Workspace created successfully");
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
    },
    onError: () => {
      toast.error("Failed to create workspace");
    },
  });

  return mutation;
};

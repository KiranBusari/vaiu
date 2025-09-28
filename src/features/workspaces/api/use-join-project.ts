import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/lib/rpc";
import { toast } from "sonner";

type ResponseType = InferResponseType<
  (typeof client.api.v1.workspaces)[":workspaceId"]["projects"][":projectId"]["join"]["$post"],
  200
>;
type RequestType = InferRequestType<
  (typeof client.api.v1.workspaces)[":workspaceId"]["projects"][":projectId"]["join"]["$post"]
>;

export const useJoinProject = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ param, json }) => {
      const response = await client.api.v1.workspaces[":workspaceId"][
        "projects"
      ][":projectId"]["join"].$post({
        param,
        json,
      });
      if (!response.ok) throw new Error("Failed to join project");
      return await response.json();
    },
    onSuccess: ({ data }) => {
      toast.success("Project joined successfully");
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
      queryClient.invalidateQueries({ queryKey: ["workspace", data.$id] });
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["project", data.$id] });
    },
    onError: (e) => {
      toast.error(e.message || "Failed to join project");
    },
  });

  return mutation;
};

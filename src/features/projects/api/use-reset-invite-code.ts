import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/lib/rpc";
import { toast } from "sonner";

type ResponseType = InferResponseType<
  (typeof client.api.v1.projects)[":workspaceId"]["projects"][":projectId"]["reset-invite-code"]["$post"],
  200
>;
type RequestType = InferRequestType<
  (typeof client.api.v1.projects)[":workspaceId"]["projects"][":projectId"]["reset-invite-code"]["$post"]
>;

export const useResetInviteCode = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ param }) => {
      const response = await client.api.v1.projects[":workspaceId"]["projects"][":projectId"][
        "reset-invite-code"
      ].$post({
        param,
      });
      if (!response.ok) throw new Error("Failed to reset invite code");
      return await response.json();
    },
    onSuccess: ({ data }) => {
      toast.success("Invite code reset successfully");
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
      queryClient.invalidateQueries({ queryKey: ["workspace", data.$id] });
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["project", data.$id] });
    },
    onError: (e) => {
      toast.error(e.message || "Failed to reset invite code");
    },
  });

  return mutation;
};

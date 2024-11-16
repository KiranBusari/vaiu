import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/lib/rpc";
import { toast } from "sonner";

type ResponseType = InferResponseType<
  (typeof client.api.rooms)[":roomId"]["$delete"],
  200
>;
type RequestType = InferRequestType<
  (typeof client.api.rooms)[":roomId"]["$delete"]
>;

export const useDeleteProject = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ param }) => {
      const response = await client.api.rooms[":roomId"].$delete({
        param,
      });

      if (!response.ok) throw new Error("Failed to delete room");
      return await response.json();
    },
    onSuccess: ({ data }) => {
      toast.success("Room deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
      queryClient.invalidateQueries({ queryKey: ["room", data.$id] });
    },
    onError: () => {
      toast.error("Failed to delete room");
    },
  });

  return mutation;
};

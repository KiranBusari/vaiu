import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/lib/rpc";
import { toast } from "sonner";

type ResponseType = InferResponseType<
  (typeof client.api.rooms)["$post"],
  200
>;
type RequestType = InferRequestType<(typeof client.api.rooms)["$post"]>;

export const useCreateRoom = ()  => {
  const queryClient = useQueryClient();
  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ form }) => {
      const response = await client.api.rooms.$post({ form });
      if (!response.ok) throw new Error("Failed to create room");
      return await response.json();
    },
    onSuccess: () => {
      toast.success("Room created successfully");
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
    },
    onError: () => {
      toast.error("Failed to create room");
    },
  });

  return mutation;
};

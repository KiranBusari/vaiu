import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/lib/rpc";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

type ResponseType = InferResponseType<
  (typeof client.api.v1.auth.login)["$post"]
>;
type RequestType = InferRequestType<(typeof client.api.v1.auth.login)["$post"]>;

export const useLogin = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json }) => {
      const response = await client.api.v1.auth.login.$post({ json });
      if (!response.ok) throw new Error("Failed to login");
      return await response.json();
    },
    onSuccess: () => {
      router.push("/verify");
      toast.success("Logged in successfully");
      queryClient.invalidateQueries({ queryKey: ["current"] });
    },
    onError: () => {
      toast.error("Failed to login");
    },
  });

  return mutation;
};

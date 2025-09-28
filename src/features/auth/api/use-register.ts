import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/lib/rpc";

type ResponseType = InferResponseType<
  (typeof client.api.v1.auth.register)["$post"]
>;
type RequestType = InferRequestType<
  (typeof client.api.v1.auth.register)["$post"]
>;

export const useRegister = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json }) => {
      const response = await client.api.v1.auth.register.$post({ json });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          "error" in errorData ? errorData.error : "Failed to signup",
        );
      }
      return await response.json();
    },
    onSuccess: () => {
      router.push("/verify");
      toast.success("Registered successfully!");
      queryClient.invalidateQueries({ queryKey: ["current"] });
    },
    onError: (e) => {
      toast.error(e.message || "Failed to register");
    },
  });

  return mutation;
};

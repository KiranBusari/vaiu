import { useMutation, useQueryClient } from "@tanstack/react-query";
// import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/lib/rpc";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export const useVerify = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async () => {
      const response = await client.api.v1.auth.verify.$post();
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          "error" in errorData ? String(errorData.error) : "Failed to login",
        );
      }
      return await response.json();
    },
    onSuccess: () => {
      router.refresh();
      toast.success("Verification email sent successFully");
      queryClient.invalidateQueries({ queryKey: ["current"] });
    },
    onError: (e) => {
      toast.error(e.message || "Failed to send verification email");
    },
  });
  return mutation;
};

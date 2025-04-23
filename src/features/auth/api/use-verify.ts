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
      if (!response.ok) throw new Error("Failed to send verification email");
      return await response.json();
    },
    onSuccess: () => {
      router.refresh();
      toast.success("Verification email sent successFully");
      queryClient.invalidateQueries({ queryKey: ["current"] });
    },
    onError: () => {
      toast.error("Failed to send verification email");
    },
  });
  return mutation;
};

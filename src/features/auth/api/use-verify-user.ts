import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { client } from "@/lib/rpc";
import { VerifyUserSchema } from "@/features/auth/schemas";

export const useVerifyUser = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: async () => {
      const response = await client.api.v1.auth["verify-user"].$post({});
      if (!response.ok) throw new Error("Failed to reset verify user");
      return response.json();
    },
    onSuccess: () => {
      toast.success("User Verified Successfully");
      router.refresh();
    },
    onError: () => {
      toast.error("Failed to verify user");
    },
  });
};

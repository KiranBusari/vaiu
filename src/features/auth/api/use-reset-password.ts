import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { client } from "@/lib/rpc";
import type { ResetPasswordSchema } from "../schemas";

export const useResetPassword = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: async (values: ResetPasswordSchema) => {
      const response = await client.api.v1.auth["update-password"].$post({
        json: values,
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          "error" in errorData ? String(errorData.error) : "Failed to login",
        );
      }
      return response.json();
    },
    onSuccess: () => {
      toast.success("Password reset successfully");
      router.push("/sign-in");
    },
    onError: (e) => {
      toast.error(e.message || "Failed to reset password");
    },
  });
};

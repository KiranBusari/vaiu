import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { client } from "@/lib/rpc";

// Use the existing verify endpoint for resending verification emails
export const useResendVerification = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async () => {
      const response = await client.api.v1.auth.verify.$post();

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          "error" in errorData
            ? String(errorData.error)
            : "Failed to resend verification email",
        );
      }

      return response.json();
    },
    onSuccess: () => {
      toast.success("Verification email sent successfully!");
      queryClient.invalidateQueries({ queryKey: ["current"] });
    },
    onError: (error) => {
      console.error("Resend verification error:", error);
      toast.error(error.message || "Failed to resend verification email");
    },
  });

  return mutation;
};

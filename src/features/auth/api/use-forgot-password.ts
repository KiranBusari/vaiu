import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { client } from "@/lib/rpc";

export const useForgotPassword = () => {
  return useMutation({
    mutationFn: async (values: { email: string }) => {
      const response = await client.api.v1.auth["forgot-password"].$post({
        json: values,
      });
      if (!response.ok) throw new Error("Failed to send recovery email");
      return response.json();
    },
    onSuccess: () => {
      toast.success("Recovery email sent successfully");
    },
    onError: () => {
      toast.error("Failed to send recovery email");
    },
  });
};

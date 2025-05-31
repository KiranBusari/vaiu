import { useMutation, useQueryClient } from "@tanstack/react-query";
import { client } from "@/lib/rpc";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface VerifyUserInput {
  userId: string;
  secret: string;
}

interface VerifyUserResponse {
  success: boolean;
  message: string;
}

export const useVerifyUser = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const mutation = useMutation<
    VerifyUserResponse,
    Error,
    { json: VerifyUserInput }
  >({
    mutationFn: async ({ json }) => {
      const response = await client.api.v1.auth["verify-user"].$post({ json });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          "error" in errorData ? String(errorData.error) : "Failed to login",
        );
      }

      return response.json();
    },
    onSuccess: (data) => {
      router.refresh();
      toast.success(data.message || "Verification completed successfully");
      queryClient.invalidateQueries({ queryKey: ["current"] });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to verify user");
    },
  });

  return mutation;
};

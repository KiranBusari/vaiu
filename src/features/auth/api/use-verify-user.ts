import { useMutation, useQueryClient } from "@tanstack/react-query";
import { client } from "@/lib/rpc";
import { toast } from "sonner";

interface VerifyUserInput {
  userId: string;
  secret: string;
}

interface VerifyUserResponse {
  success: boolean;
  message: string;
}

export const useVerifyUser = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<
    VerifyUserResponse,
    Error,
    { json: VerifyUserInput }
  >({
    mutationFn: async ({ json }) => {
      const response = await client.api.v1.auth["verify-user"].$post({ json });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to verify user");
      }

      return response.json();
    },
    onSuccess: (data) => {
      toast.success(data.message || "Verification completed successfully");
      queryClient.invalidateQueries({ queryKey: ["current"] });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to verify user");
    },
  });

  return mutation;
};

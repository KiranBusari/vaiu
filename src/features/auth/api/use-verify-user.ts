import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { client } from "@/lib/rpc";

type ResponseType = InferResponseType<
  (typeof client.api.v1.auth)["verify-user"]["$post"]
>;
type RequestType = InferRequestType<
  (typeof client.api.v1.auth)["verify-user"]["$post"]
>;

export const useVerifyUser = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json }) => {
      const response = await client.api.v1.auth["verify-user"].$post({ json });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          "error" in errorData
            ? String(errorData.error)
            : "Failed to verify user",
        );
      }

      return response.json();
    },
    onSuccess: async (data) => {
      toast.success(data?.message || "Email verified successfully!");
      
      // Only invalidate the current user query to refresh verification status
      // Don't clear all queries to maintain session state
      await queryClient.invalidateQueries({ queryKey: ["current"] });
      
      // Wait for the query to refetch with updated verification status
      setTimeout(async () => {
        // Ensure the current user query is refetched with latest verification status
        await queryClient.refetchQueries({ queryKey: ["current"] });
        
        // Redirect to sign-in which properly handles verified users
        router.replace("/sign-in");
      }, 1000);
    },
    onError: (error) => {
      console.error("Verification error:", error);
      toast.error(error.message || "Failed to verify user");
    },
  });

  return mutation;
};

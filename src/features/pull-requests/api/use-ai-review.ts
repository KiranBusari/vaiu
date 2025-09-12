import { useMutation } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { client } from "@/lib/rpc";
import { toast } from "sonner";

// AI Review Mutation Types
type AIReviewResponseType = InferResponseType<
  (typeof client.api.v1)["pull-requests"][":projectId"]["ai-review"][":prNumber"]["$post"],
  200
>;
type AIReviewRequestType = InferRequestType<
  (typeof client.api.v1)["pull-requests"][":projectId"]["ai-review"][":prNumber"]["$post"]
>;

// Hook for generating AI review
export const useAIReview = () => {
  const mutation = useMutation<AIReviewResponseType, Error, AIReviewRequestType>({
    mutationFn: async ({ param }) => {
      const response = await client.api.v1["pull-requests"][":projectId"]["ai-review"][":prNumber"].$post({
        param,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          "error" in errorData ? errorData.error : "Failed to generate AI review"
        );
      }

      return await response.json();
    },
    onSuccess: () => {
      toast.success("AI review generated successfully");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to generate AI review");
    },
  });

  return mutation;
};

// Helper hook for easier usage with PR data
export const useGenerateAIReview = () => {
  const aiReviewMutation = useAIReview();

  const generateReview = async (params: {
    projectId: string;
    prNumber: number;
  }) => {
    return aiReviewMutation.mutateAsync({
      param: {
        projectId: params.projectId,
        prNumber: params.prNumber.toString(),
      },
    });
  };

  return {
    generateReview,
    isLoading: aiReviewMutation.isPending,
    error: aiReviewMutation.error,
    data: aiReviewMutation.data,
    reset: aiReviewMutation.reset,
  };
};
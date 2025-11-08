import { useMutation } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { client } from "@/lib/rpc";
import { toast } from "sonner";

type TestGenerationResponseType = InferResponseType<
  (typeof client.api.v1)["pull-requests"][":projectId"]["generate-tests"][":prNumber"]["$post"],
  200
>;
type TestGenerationRequestType = InferRequestType<
  (typeof client.api.v1)["pull-requests"][":projectId"]["generate-tests"][":prNumber"]["$post"]
>;

export const useGenerateTests = () => {
  const mutation = useMutation<
    TestGenerationResponseType,
    Error,
    TestGenerationRequestType
  >({
    mutationFn: async ({ param }) => {
      const response = await client.api.v1["pull-requests"][":projectId"][
        "generate-tests"
      ][":prNumber"].$post({
        param,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          "error" in errorData ? errorData.error : "Failed to generate tests",
        );
      }

      return await response.json();
    },
    onSuccess: () => {
      toast.success("Test cases generated successfully");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to generate test cases");
    },
  });

  return mutation;
};

// Helper hook for easier usage with PR data
export const useGenerateTestCases = () => {
  const testGenerationMutation = useGenerateTests();

  const generateTests = async (params: {
    projectId: string;
    prNumber: number;
  }) => {
    return testGenerationMutation.mutateAsync({
      param: {
        projectId: params.projectId,
        prNumber: params.prNumber.toString(),
      },
    });
  };

  return {
    generateTests,
    isLoading: testGenerationMutation.isPending,
    error: testGenerationMutation.error,
    data: testGenerationMutation.data,
    reset: testGenerationMutation.reset,
  };
};

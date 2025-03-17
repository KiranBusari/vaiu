import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType } from "hono";

import { client } from "@/lib/rpc";
import { toast } from "sonner";

interface PlansResponse {
  data: {
    $id: string;
  };
}

type RequestType = InferRequestType<(typeof client.api.v1.plans[":planName"])["$post"]>;

export const useCreatePlan = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation<PlansResponse, Error, RequestType>({
    mutationFn: async ({ param }): Promise<PlansResponse> => {
      const response = await client.api.v1.plans[":planName"].$post({ param });
      if (!response.ok) throw new Error("Failed to create Plan for user");
      return (await response.json()) as PlansResponse;
    },
    onSuccess: () => {
      toast.success("Plan created successfully for the user.");
      queryClient.invalidateQueries({ queryKey: ["plans"] });
    },
    onError: () => {
      toast.error("Failed to create plan for user.");
    },
  });

  return mutation;
};

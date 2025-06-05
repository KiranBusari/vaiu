import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/lib/rpc";
import { toast } from "sonner";

type ResponseType = InferResponseType<
  (typeof client.api.v1.projects)["upload-file"]["$post"],
  200
>;
type RequestType = InferRequestType<
  (typeof client.api.v1.projects)["upload-file"]["$post"]
>;

export const useFileUpload = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ form }) => {
      const response = await client.api.v1.projects["upload-file"].$post({
        form,
      });

      if (!response.ok) throw new Error("Failed to upload file");
      return await response.json();
    },
    onSuccess: () => {
      toast.success("File uploaded successfully");
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
    onError: () => {
      toast.error("Failed to upload file");
    },
  });

  return mutation;
};

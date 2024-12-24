import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/lib/rpc";
import { toast } from "sonner";

type ResponseType = InferResponseType<
    (typeof client.api.projects)[":projectId"]["submit-pull-request"]["$post"],
    200
>;
type RequestType = InferRequestType<(typeof client.api.projects)[":projectId"]["submit-pull-request"]["$post"]>;

export const useCreatePr = () => {
    const queryClient = useQueryClient();
    const mutation = useMutation<ResponseType, Error, RequestType>({
        mutationFn: async ({ param, form }) => {
            const response = await client.api.projects[":projectId"]["submit-pull-request"].$post({
                param,
                form
            });
            console.log(response);

            if (!response.ok) throw new Error("Failed to create PR");
            return await response.json();
        },
        onSuccess: () => {
            toast.success("PR created successfully");
            queryClient.invalidateQueries({ queryKey: ["submit-pull-request"] });
        },
        onError: () => {
            toast.error("Failed to create PR");
        },
    });

    return mutation;
};

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/lib/rpc";
import { toast } from "sonner";

type ResponseType = InferResponseType<
    (typeof client.api.v1.projects)[":projectId"]["members"][":memberId"]["$delete"],
    200
>;
type RequestType = InferRequestType<
    (typeof client.api.v1.projects)[":projectId"]["members"][":memberId"]["$delete"]
>;

export const useRemoveProjectMember = () => {
    const queryClient = useQueryClient();
    const mutation = useMutation<ResponseType, Error, RequestType>({
        mutationFn: async ({ param }) => {
            const response = await client.api.v1.projects[":projectId"]["members"][":memberId"].$delete({
                param,
            });
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(
                    "error" in errorData ? errorData.error : "Failed to remove member from project",
                );
            }
            return await response.json();
        },
        onSuccess: () => {
            toast.success("Member removed from project successfully");
            queryClient.invalidateQueries({ queryKey: ["members"] });
            queryClient.invalidateQueries({ queryKey: ["project-members"] });
        },
        onError: (e) => {
            toast.error(e.message || "Failed to remove member from project");
        },
    });

    return mutation;
};
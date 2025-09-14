import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { client } from "@/lib/rpc";

// Hook to get all super admins
export const useGetSuperAdmins = () => {
    return useQuery({
        queryKey: ["super-admins"],
        queryFn: async () => {
            const response = await client.api.v1.members["super-admins"].$get();
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(
                    "error" in errorData ? errorData.error : "Failed to fetch super admins",
                );
            }
            const { data } = await response.json();
            return data;
        },
    });
};

// Hook to assign super admin role
export const useAssignSuperAdmin = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: { userId: string; workspaceId: string }) => {
            const response = await client.api.v1.members["assign-super-admin"].$post({
                json: data,
            });
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(
                    "error" in errorData ? errorData.error : "Failed to assign super admin role",
                );
            }
            return response.json();
        },
        onSuccess: () => {
            // Invalidate super admins list
            queryClient.invalidateQueries({ queryKey: ["super-admins"] });
            // Invalidate members list for the workspace
            queryClient.invalidateQueries({ queryKey: ["members"] });
        },
    });
};

// Hook to remove super admin role
export const useRemoveSuperAdmin = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (memberId: string) => {
            const response = await fetch(`/api/v1/members/remove-super-admin/${memberId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(
                    "error" in errorData ? errorData.error : "Failed to remove super admin role",
                );
            }
            return response.json();
        },
        onSuccess: () => {
            // Invalidate super admins list
            queryClient.invalidateQueries({ queryKey: ["super-admins"] });
            // Invalidate members list for the workspace
            queryClient.invalidateQueries({ queryKey: ["members"] });
        },
    });
};

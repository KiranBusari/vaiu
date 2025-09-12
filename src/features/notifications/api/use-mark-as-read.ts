import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Notification } from "../types";
import { Models } from "node-appwrite";

export const useMarkAsRead = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (notificationId: string) => {
      const response = await fetch(`/api/v1/notifications/${notificationId}/mark-as-read`, {
        method: "POST",
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          "error" in errorData ? errorData.error : "Failed to mark as read",
        );
      }
      const { data } = await response.json();
      return data;
    },
    onMutate: async (notificationId: string) => {
      await queryClient.cancelQueries({ queryKey: ["notifications"] });

      const previousNotifications = queryClient.getQueryData<Models.DocumentList<Notification>>(["notifications"]);

      queryClient.setQueryData<Models.DocumentList<Notification>>(["notifications"], (old) => {
        if (!old) {
          return old;
        }
        return {
          ...old,
          documents: old.documents.map((notification) =>
            notification.$id === notificationId
              ? { ...notification, isRead: true }
              : notification,
          ),
        };
      });

      return { previousNotifications };
    },
    onError: (err, notificationId, context) => {
      queryClient.setQueryData(
        ["notifications"],
        context?.previousNotifications,
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  return mutation;
};

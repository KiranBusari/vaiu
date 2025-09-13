"use client";

import { Models } from "node-appwrite";
import { Notification } from "../types";
import { NotificationItem } from "./notification-item";

interface NotificationListProps {
  notifications: Models.DocumentList<Notification> | undefined;
  isLoading: boolean;
}

export const NotificationList = ({ notifications, isLoading }: NotificationListProps) => {

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (!notifications || notifications.documents.length === 0) {
    return <p>You have no notifications.</p>;
  }

  return (
    <div className="space-y-4">
      {notifications?.documents.map((notification) => (
        <NotificationItem key={notification.$id} notification={notification} />
      ))}
    </div>
  );
};
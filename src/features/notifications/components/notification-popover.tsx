"use client";

import { BellIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { NotificationList } from "./notification-list";

import { useGetNotifications } from "../api/use-get-notifications";

export const NotificationPopover = () => {
  const { data: notifications, isLoading } = useGetNotifications();

  const unreadCount = notifications?.documents.filter(
    (notification) => !notification.isRead,
  ).length;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon">
          <BellIcon className="h-4 w-4" />
          {unreadCount && unreadCount > 0 && (
            <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-blue-500" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-md shadow-lg">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Notifications</h4>
            <p className="text-sm text-muted-foreground">
              You have {unreadCount} unread messages.
            </p>
          </div>
          <NotificationList notifications={notifications} isLoading={isLoading} />
        </div>
      </PopoverContent>
    </Popover>
  );
};

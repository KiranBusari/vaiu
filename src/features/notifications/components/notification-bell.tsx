"use client";

import { Bell } from "lucide-react";
import { useGetNotifications } from "../api/use-get-notifications";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { NotificationList } from "./notification-list";

export const NotificationBell = () => {
  const { data: notifications, isLoading } = useGetNotifications();

  const unreadCount = notifications?.documents.filter(
    (notification) => !notification.isRead
  ).length;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <div className="relative">
          <Bell className="size-6" />
          {unreadCount && unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -right-2 -top-2 flex size-5 items-center justify-center rounded-full p-0"
            >
              {unreadCount}
            </Badge>
          )}
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <NotificationList notifications={notifications} isLoading={isLoading} />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

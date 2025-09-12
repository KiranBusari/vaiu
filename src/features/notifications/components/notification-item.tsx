import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { Notification } from "../types";

import { useMarkAsRead } from "@/features/notifications/api/use-mark-as-read";

interface NotificationItemProps {
  notification: Notification;
}

export const NotificationItem = ({
  notification,
}: NotificationItemProps) => {
  const markAsRead = useMarkAsRead();

  return (
    <div className="flex items-center p-4 border-b border-gray-200 dark:border-gray-800">
      {!notification.isRead && (
        <div className="w-2 h-2 mr-2 rounded-full bg-blue-500" />
      )}
      <Avatar className="h-9 w-9">
        <AvatarImage src="/avatars/1.png" alt="Avatar" />
        <AvatarFallback>OM</AvatarFallback>
      </Avatar>
      <div className="ml-4 space-y-1">
        <p className="text-sm font-medium leading-none">
          {notification.title}
        </p>
        <p className="text-sm text-muted-foreground">
          {notification.body}
        </p>
      </div>
      <div className="ml-auto">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
            >
              <DotsHorizontalIcon className="h-4 w-4" />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[160px]">
            <DropdownMenuItem onClick={() => markAsRead.mutate(notification.$id)}>
              Mark as read
            </DropdownMenuItem>
            <DropdownMenuItem>View issue</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

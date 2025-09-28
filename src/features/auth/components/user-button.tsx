"use client";
import { Loader, LogOut } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DottedSeparator } from "@/components/dotted-separator";

import { useCurrent } from "../api/use-curent";
import { useLogout } from "../api/use-logout";

export const UserButton = () => {
  const { mutate: logout } = useLogout();
  const { data: user, isLoading } = useCurrent();
  if (isLoading) {
    return (
      <div className="flex size-10 items-center justify-center rounded-full border border-gray-300 bg-slate-200 dark:border-gray-700 dark:bg-gray-800">
        <Loader className="size-4 animate-spin text-muted-foreground" />
      </div>
    );
  }
  if (!user) return null;
  const { name, email } = user;
  const avatarFallback = name
    ? name.charAt(0).toUpperCase()
    : (email.charAt(0).toUpperCase() ?? "U");

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger className="relative outline-none">
        <Avatar className="size-10 border border-gray-300 transition hover:opacity-75 dark:border-gray-700">
          <AvatarFallback className="flex items-center justify-center bg-slate-200 font-medium text-gray-500 dark:bg-gray-800 dark:text-gray-400">
            {avatarFallback}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        side="bottom"
        className="w-60"
        sideOffset={10}
      >
        <div className="flex flex-col items-center justify-center gap-2 px-2.5 py-4">
          <Avatar className="size-[52px] border border-gray-300 dark:border-gray-700">
            <AvatarFallback className="flex items-center justify-center bg-gray-300 text-xl font-medium text-gray-500 dark:bg-gray-800 dark:text-gray-400">
              {avatarFallback}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col items-center justify-center">
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
              {name || "User"}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{email}</p>
          </div>
        </div>
        <DottedSeparator className="mb-1" />
        <DropdownMenuItem
          onClick={() => logout()}
          className="flex h-10 cursor-pointer items-center justify-center font-medium text-amber-700"
        >
          <LogOut className="mr-2 size-4" />
          Log Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

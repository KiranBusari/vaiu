"use client";

import Link from "next/link";
import { Settings, UsersIcon } from "lucide-react";
import {
  GoCheckCircle,
  GoCheckCircleFill,
  GoHome,
  GoHomeFill,
} from "react-icons/go";
import { cn } from "@/lib/utils";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { usePathname } from "next/navigation";

const router = [
  {
    label: "Home",
    href: "",
    icon: GoHome,
    aciveIcon: GoHomeFill,
  },
  {
    label: "Issues",
    href: "/tasks",
    icon: GoCheckCircle,
    aciveIcon: GoCheckCircleFill,
  },
  {
    label: "Settings",
    href: "/settings",
    icon: Settings,
    aciveIcon: Settings,
  },
  {
    label: "Members",
    href: "/members",
    icon: UsersIcon,
    aciveIcon: UsersIcon,
  },
];
export const Navigation = () => {
  const workspaceId = useWorkspaceId();
  const pathname = usePathname();
  return (
    <ul className="flex flex-col">
      {router.map(({ aciveIcon, href, icon, label }) => {
        const absoluteHref = `/workspaces/${workspaceId}${href}`;
        const isActive = pathname === absoluteHref;
        const Icon = isActive ? aciveIcon : icon;
        return (
          <Link key={href} href={absoluteHref}>
            <div
              className={cn(
                "flex items-center gap-2.5 p-2.5 rounded-md font-medium hover:text-primary transition text-slate-600 dark:text-slate-200 hover:bg-slate-100 hover:dark:bg-slate-700/50 m-0.5",
                isActive &&
                  "bg-slate-50 dark:bg-slate-800 shadow-sm hover:opacity-100 text-primary"
              )}
            >
              <Icon className="size-5" />
              {label}
            </div>
          </Link>
        );
      })}
    </ul>
  );
};

"use client";

import Link from "next/link";
import {
  GoCheckCircle,
  GoCheckCircleFill,
  GoHome,
  GoHomeFill,
} from "react-icons/go";
import { cn } from "@/lib/utils";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { usePathname } from "next/navigation";
import { RiSettings2Fill, RiSettings2Line } from "react-icons/ri";
import { FaUsers, FaUsersCog } from "react-icons/fa";

const router = [
  {
    label: "Home",
    href: "/",
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
    icon: RiSettings2Line,
    aciveIcon: RiSettings2Fill,
  },
  {
    label: "Members",
    href: "/members",
    icon: FaUsersCog,
    aciveIcon: FaUsers,
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
                "m-0.5 flex items-center gap-2.5 rounded-md p-2.5 font-medium text-slate-600 transition hover:bg-slate-100 hover:text-primary dark:text-slate-200 hover:dark:bg-slate-700/50",
                isActive &&
                  "bg-slate-50 text-primary shadow-sm hover:opacity-100 dark:bg-slate-800",
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

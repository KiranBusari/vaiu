"use client";

import Link from "next/link";
import { Code2, Settings, UsersIcon, Loader2 } from "lucide-react";
import {
  GoCheckCircle,
  GoCheckCircleFill,
  GoHome,
  GoHomeFill,
} from "react-icons/go";
import { cn } from "@/lib/utils";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { useIsMember } from "@/features/workspaces/api/use-is-member";
import { useGetWorkspaceInfo } from "@/features/workspaces/api/use-get-workspace-info";
import { RiSettings2Fill, RiSettings2Line } from "react-icons/ri";
import { FaUsers, FaUsersCog } from "react-icons/fa";

const navItems = [
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
  {
    label: "Contributions",
    icon: Code2,
    aciveIcon: Code2,
    dynamicRedirect: true,
  },
];

export const Navigation = () => {
  const workspaceId = useWorkspaceId();
  const pathname = usePathname();
  const router = useRouter();

  // const OPEN_CONTRIBUTION_WORKSPACE_ID = process.env.OPEN_CONTRIBUTION_WORKSPACE_ID || "";

  // TODO: Remove this
  const OPEN_CONTRIBUTION_WORKSPACE_ID = "683e4f3900212432e9d6";

  const { data: isOpenContributionMember, isLoading: isOpenContributionMemberLoading } = useIsMember(OPEN_CONTRIBUTION_WORKSPACE_ID);
  const { data: openContributionInfo, isLoading: openContributionInfoLoading } = useGetWorkspaceInfo({ workspaceId: OPEN_CONTRIBUTION_WORKSPACE_ID });

  const isLoading = isOpenContributionMemberLoading || openContributionInfoLoading;

  const handleContributeClick = () => {

    if (isOpenContributionMember) {
      router.push(`http://localhost:3000/workspaces/${OPEN_CONTRIBUTION_WORKSPACE_ID}`);
    } else if (openContributionInfo?.inviteCode) {
      router.push(`http://localhost:3000/workspaces/${OPEN_CONTRIBUTION_WORKSPACE_ID}/join/${openContributionInfo?.inviteCode}`);
    }
  };

  return (
    <ul className="flex flex-col">
      {navItems.map(({ aciveIcon, href, icon, label, dynamicRedirect }) => {
        const absoluteHref = label === "Contributions" ? `/workspaces/${OPEN_CONTRIBUTION_WORKSPACE_ID}` : `/workspaces/${workspaceId}${href ?? ""}`;
        const isActive = pathname === absoluteHref;
        const Icon = isActive ? aciveIcon : icon;

        if (dynamicRedirect) {
          return (
            <button
              key={label}
              type="button"
              onClick={handleContributeClick}
              disabled={isLoading}
              className={cn(
                "flex items-center gap-2.5 p-2.5 rounded-md font-medium w-full text-left hover:text-primary transition text-slate-600 dark:text-slate-200 hover:bg-slate-100 hover:dark:bg-slate-700/50 m-0.5",
                isActive &&
                "bg-slate-50 dark:bg-slate-800 shadow-sm hover:opacity-100 text-primary",
                isLoading && "opacity-60 cursor-not-allowed"
              )}
            >
              {isLoading ? (
                <Loader2 className="size-5 animate-spin" />
              ) : (
                Icon && <Icon className="size-5" />
              )}
              {label}
            </button>
          );
        }

        return (
          <Link key={href} href={absoluteHref}>
            <div
              className={cn(
                "m-0.5 flex items-center gap-2.5 rounded-md p-2.5 font-medium text-slate-600 transition hover:bg-slate-100 hover:text-primary dark:text-slate-200 hover:dark:bg-slate-700/50",
                isActive &&
<<<<<<< HEAD
                "bg-slate-50 dark:bg-slate-800 shadow-sm hover:opacity-100 text-primary"
=======
                  "bg-slate-50 text-primary shadow-sm hover:opacity-100 dark:bg-slate-800",
>>>>>>> main
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

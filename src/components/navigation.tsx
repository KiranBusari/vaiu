"use client";

import Link from "next/link";
import { Code2, Loader2 } from "lucide-react";
import {
  GoCheckCircle,
  GoCheckCircleFill,
  GoHome,
  GoHomeFill,
} from "react-icons/go";
import { cn } from "@/lib/utils";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { usePathname } from "next/navigation";
import { useIsMember } from "@/features/workspaces/api/use-is-member";
import { useGetWorkspaceInfo } from "@/features/workspaces/api/use-get-workspace-info";
import { RiSettings2Fill, RiSettings2Line } from "react-icons/ri";
import { FaUsers, FaUsersCog } from "react-icons/fa";
import { User, UserCircle } from "lucide-react";

const navItems = [
  {
    label: "Home",
    href: "/",
    icon: GoHome,
    activeIcon: GoHomeFill,
  },
  {
    label: "Issues",
    href: "/tasks",
    icon: GoCheckCircle,
    activeIcon: GoCheckCircleFill,
  },
  {
    label: "Settings",
    href: "/settings",
    icon: RiSettings2Line,
    activeIcon: RiSettings2Fill,
  },
  {
    label: "Account",
    href: "/account",
    icon: User,
    activeIcon: UserCircle,
  },
  {
    label: "Members",
    href: "/members",
    icon: FaUsersCog,
    activeIcon: FaUsers,
  },
  {
    label: "Contributions",
    icon: Code2,
    activeIcon: Code2,
    dynamicRedirect: true,
  },
];

export const Navigation = () => {
  const workspaceId = useWorkspaceId();
  const pathname = usePathname();

  // const OPEN_CONTRIBUTION_WORKSPACE_ID = process.env.OPEN_CONTRIBUTION_WORKSPACE_ID || "";

  // TODO: Remove this
  const OPEN_CONTRIBUTION_WORKSPACE_ID = "683e4f3900212432e9d6";

  const {
    data: isOpenContributionMember,
    isLoading: isOpenContributionMemberLoading,
  } = useIsMember(OPEN_CONTRIBUTION_WORKSPACE_ID);
  const { data: openContributionInfo, isLoading: openContributionInfoLoading } =
    useGetWorkspaceInfo({ workspaceId: OPEN_CONTRIBUTION_WORKSPACE_ID });

  const isLoading =
    isOpenContributionMemberLoading || openContributionInfoLoading;

  // Don't render navigation if workspaceId is not available
  if (!workspaceId) {
    return null;
  }

  return (
    <ul className="flex flex-col">
      {navItems.map(({ activeIcon, href, icon, label, dynamicRedirect }) => {
        const absoluteHref =
          label === "Contributions"
            ? `/workspaces/${OPEN_CONTRIBUTION_WORKSPACE_ID}`
            : `/workspaces/${workspaceId}${href ?? ""}`;

        // Determine if we're in the contributions workspace
        const inContributionsWorkspace = pathname.startsWith(
          `/workspaces/${OPEN_CONTRIBUTION_WORKSPACE_ID}`,
        );

        // Check if path is active, with special cases for Home and Contributions
        const isActive =
          label === "Home"
            ? pathname === absoluteHref ||
            pathname === `/workspaces/${workspaceId}` ||
            pathname === `/workspaces/${workspaceId}/`
            : label === "Contributions"
              ? inContributionsWorkspace
              : pathname === absoluteHref ||
              pathname.startsWith(`${absoluteHref}/`);
        const Icon = isActive ? activeIcon : icon;

        if (dynamicRedirect) {
          // Use Link instead of button to prevent reload issues
          const contributionHref = isOpenContributionMember
            ? `/workspaces/${OPEN_CONTRIBUTION_WORKSPACE_ID}`
            : openContributionInfo?.inviteCode
              ? `/workspaces/${OPEN_CONTRIBUTION_WORKSPACE_ID}/join/${openContributionInfo?.inviteCode}`
              : `/workspaces/${OPEN_CONTRIBUTION_WORKSPACE_ID}`;

          return (
            <li key={label}>
              {isLoading ? (
                <div
                  className={cn(
                    "m-0.5 flex w-full items-center gap-2.5 rounded-md p-2.5 font-medium text-slate-600 dark:text-slate-200",
                    "cursor-not-allowed opacity-60",
                  )}
                >
                  <Loader2 className="size-5 animate-spin" />
                  {label}
                </div>
              ) : (
                <Link
                  href={contributionHref}
                  className={cn(
                    "m-0.5 flex w-full items-center gap-2.5 rounded-md p-2.5 text-left font-medium transition",
                    isActive
                      ? "bg-slate-200 text-primary hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600"
                      : "text-slate-600 hover:bg-slate-100 hover:text-primary dark:text-slate-200 hover:dark:bg-slate-700/50",
                  )}
                >
                  <Icon className="size-5" />
                  {label}
                </Link>
              )}
            </li>
          );
        }

        return (
          <li key={href}>
            <Link
              href={absoluteHref}
              className={cn(
                "m-0.5 flex items-center gap-2.5 rounded-md p-2.5 font-medium transition",
                isActive
                  ? "bg-slate-200 text-primary hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600"
                  : "text-slate-600 hover:bg-slate-100 hover:text-primary dark:text-slate-200 hover:dark:bg-slate-700/50",
              )}
            >
              <Icon className="size-5" />
              {label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
};

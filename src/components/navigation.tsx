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
import { useRouter } from "next/navigation";
import { useIsMember } from "@/features/workspaces/api/use-is-member";
import { useGetWorkspaceInfo } from "@/features/workspaces/api/use-get-workspace-info";
import {
  RiBillFill,
  RiBillLine,
  RiSettings2Fill,
  RiSettings2Line,
} from "react-icons/ri";
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
    label: "Subscription",
    // Workspace-scoped subscription path (will be prefixed with /workspaces/[workspaceId])
    href: "/subscription",
    icon: RiBillLine,
    aciveIcon: RiBillFill,
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

  const {
    data: isOpenContributionMember,
    isLoading: isOpenContributionMemberLoading,
  } = useIsMember(OPEN_CONTRIBUTION_WORKSPACE_ID);
  const { data: openContributionInfo, isLoading: openContributionInfoLoading } =
    useGetWorkspaceInfo({ workspaceId: OPEN_CONTRIBUTION_WORKSPACE_ID });

  const isLoading =
    isOpenContributionMemberLoading || openContributionInfoLoading;

  const handleContributeClick = () => {
    if (isOpenContributionMember) {
      router.push(`/workspaces/${OPEN_CONTRIBUTION_WORKSPACE_ID}`);
    } else if (openContributionInfo?.inviteCode) {
      router.push(
        `/workspaces/${OPEN_CONTRIBUTION_WORKSPACE_ID}/join/${openContributionInfo?.inviteCode}`,
      );
    }
  };

  return (
    <ul className="flex flex-col">
      {navItems.map(({ aciveIcon, href, icon, label, dynamicRedirect }) => {
        const absoluteHref =
          label === "Contributions"
            ? `/workspaces/${OPEN_CONTRIBUTION_WORKSPACE_ID}`
            : `/workspaces/${workspaceId}${href ?? ""}`;

        // Determine if we're in the contributions workspace
        const inContributionsWorkspace = pathname.includes(
          `/workspaces/${OPEN_CONTRIBUTION_WORKSPACE_ID}`,
        );

        // Active logic
        const isActive =
          label === "Home"
            ? pathname === absoluteHref ||
              pathname === `/workspaces/${workspaceId}`
            : label === "Contributions"
              ? inContributionsWorkspace &&
                dynamicRedirect === true &&
                pathname !== `/workspaces/${OPEN_CONTRIBUTION_WORKSPACE_ID}` &&
                pathname !== `/workspaces/${OPEN_CONTRIBUTION_WORKSPACE_ID}/`
              : pathname === absoluteHref;
        const Icon = isActive ? aciveIcon : icon;

        if (dynamicRedirect) {
          return (
            <button
              key={label}
              type="button"
              onClick={handleContributeClick}
              disabled={isLoading}
              className={cn(
                "m-0.5 flex w-full items-center gap-2.5 rounded-md p-2.5 text-left font-medium text-slate-600 transition hover:bg-slate-100 hover:text-primary dark:text-slate-200 hover:dark:bg-slate-700/50",
                isActive &&
                  "bg-slate-50 text-primary shadow-sm hover:opacity-100 dark:bg-slate-800",
                isLoading && "cursor-not-allowed opacity-60",
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

        if (label === "Home") {
          return (
            <div
              key={href}
              onClick={() => router.push(`/workspaces/${workspaceId}`)}
              className={cn(
                "m-0.5 flex items-center gap-2.5 rounded-md p-2.5 font-medium text-slate-600 transition hover:bg-slate-100 hover:text-primary dark:text-slate-200 hover:dark:bg-slate-700/50",
                isActive &&
                  "bg-slate-50 text-primary shadow-sm hover:opacity-100 dark:bg-slate-800",
                "cursor-pointer",
              )}
            >
              <Icon className="size-5" />
              {label}
            </div>
          );
        }

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

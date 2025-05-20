"use client";

import { Navigation } from "./navigation";
import { DottedSeparator } from "./dotted-separator";
import { WorkspaceSwitcher } from "./workspace-switcher";
import Rooms from "./Rooms";
import { Logo } from "./Logo";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import Link from "next/link";
import { ProjectSwitcher } from "./project-switcher";
import { Logo2 } from "./Logo2";

export const Sidebar = () => {
  const workspaceId = useWorkspaceId();
  return (
    <aside className="h-full w-full border bg-slate-200 p-4 dark:bg-slate-950">
      <div className="flex items-center justify-center">
        <Link href={`/workspaces/${workspaceId}`}>
          <Logo className="dark:hidden" />
          <Logo2 className="hidden dark:block" />
        </Link>
      </div>
      <DottedSeparator className="my-4" />
      <WorkspaceSwitcher />
      <DottedSeparator className="my-4" />
      <Navigation />
      <DottedSeparator className="my-4" />
      <ProjectSwitcher />
      <DottedSeparator className="my-4" />
      <Rooms />
    </aside>
  );
};

"use client";

import { Projects } from "./projects";
import { Navigation } from "./navigation";
import { DottedSeparator } from "./dotted-separator";
import { WorkspaceSwitcher } from "./workspace-switcher";
import Rooms from "./Rooms";
import { Logo } from "./Logo";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import Link from "next/link";

export const Sidebar = () => {
  const workspaceId = useWorkspaceId();
  return (
    <aside className="h-full bg-gray-100 dark:bg-gray-950 p-4 w-full border">
      <div className="flex items-center justify-center">
        <Link href={`/workspaces/${workspaceId}`}>
          <Logo />
        </Link>
      </div>
      <DottedSeparator className="my-4" />
      <WorkspaceSwitcher />
      <DottedSeparator className="my-4" />
      <Navigation />
      <DottedSeparator className="my-4" />
      <Projects />
      <DottedSeparator className="my-4" />
      <Rooms />
    </aside>
  );
};

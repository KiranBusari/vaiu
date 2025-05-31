"use client";

import { Navigation } from "./navigation";
import { WorkspaceSwitcher } from "./workspace-switcher";
import Rooms from "./Rooms";
import { Logo } from "./Logo";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import Link from "next/link";
import { ProjectSwitcher } from "./project-switcher";
import { Logo2 } from "./Logo2";
import {
  SidebarContent,
  Sidebar,
  SidebarHeader,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
} from "./ui/sidebar";
import { Separator } from "./ui/separator";

export const SidebarComponent = () => {
  const workspaceId = useWorkspaceId();
  return (
    <Sidebar collapsible="icon" side="left" variant="floating">
      <SidebarContent>
        <SidebarGroup>
          <SidebarHeader>
            <div className="flex items-center justify-center">
              <Link href={`/workspaces/${workspaceId}`}>
                <Logo className="dark:hidden" />
                <Logo2 className="hidden dark:block" />
              </Link>
            </div>
          </SidebarHeader>
        </SidebarGroup>
        <Separator className="bg-slate-700" />
        <SidebarGroup>
          <SidebarGroupLabel>Workspaces</SidebarGroupLabel>
          <SidebarGroupContent>
            <WorkspaceSwitcher />
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <Navigation />
          </SidebarGroupContent>
        </SidebarGroup>
        <ProjectSwitcher />
        <Rooms />
      </SidebarContent>
    </Sidebar>
  );
};

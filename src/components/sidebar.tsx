"use client";

import { Navigation } from "./navigation";
import { WorkspaceSwitcher } from "./workspace-switcher";
// import Rooms from "./Rooms";
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
import { RiAddCircleFill } from "react-icons/ri";
import { useCreateWorkspaceModal } from "@/features/workspaces/hooks/use-create-workspace-modal";
import { useCreateProjectModal } from "@/features/projects/hooks/use-create-project-modal";
import { useCreateRoomModal } from "@/features/channels/hooks/use-create-room-modal";
import { RoomSwitcher } from "./room-switcher";
import { useProjectId } from "@/features/projects/hooks/use-projectId";

export const SidebarComponent = () => {
  const workspaceId = useWorkspaceId();
  const projectId = useProjectId();
  const { open } = useCreateWorkspaceModal();
  const { open: openProject } = useCreateProjectModal();
  const { open: openRoom } = useCreateRoomModal();
  return (
    <Sidebar collapsible="offcanvas" side="left" variant="floating">
      <SidebarContent className="p-2">
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
          <SidebarGroupLabel>
            <div className="mb-4 flex w-full items-center justify-between">
              Workspaces
              <RiAddCircleFill
                onClick={open}
                className="size-5 cursor-pointer text-gray-500 transition hover:opacity-75 dark:text-gray-400"
              />
            </div>
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <WorkspaceSwitcher />
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup className="mt-2">
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <Navigation />
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup className="mt-2">
          <SidebarGroupLabel>
            <div className="mb-4 flex w-full items-center justify-between">
              Projects
              <RiAddCircleFill
                onClick={openProject}
                className="size-5 cursor-pointer text-gray-500 transition hover:opacity-75 dark:text-gray-400"
              />
            </div>
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <ProjectSwitcher />
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup className="mt-2">
          <SidebarGroupLabel>
            <div className="mb-4 flex w-full items-center justify-between">
              Rooms
              <RiAddCircleFill
                onClick={openRoom}
                className="size-5 cursor-pointer text-gray-500 transition hover:opacity-75 dark:text-gray-400"
              />
            </div>
          </SidebarGroupLabel>
          <SidebarGroupContent>
            {/* <Rooms /> */}
            {workspaceId && projectId && (
              <RoomSwitcher workspaceId={workspaceId} projectId={projectId} />
            )}
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

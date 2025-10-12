"use client";

import { Navigation } from "./navigation";
import { WorkspaceSwitcher } from "./workspace-switcher";
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
import { useMemo, useCallback } from "react";
import { Button } from "./ui/button";

/**
 * AddButton Component - Reusable button for adding items
 */
interface AddButtonProps {
  onClick: () => void;
  label: string;
}

const AddButton = ({ onClick, label }: AddButtonProps) => (
  <Button
    variant="ghost"
    size="icon"
    onClick={onClick}
    className="h-5 w-5 shrink-0 hover:bg-muted"
    aria-label={label}
  >
    <RiAddCircleFill className="h-4 w-4 text-muted-foreground transition-colors hover:text-foreground" />
  </Button>
);

/**
 * SidebarSection Component - Reusable section with header
 */
interface SidebarSectionProps {
  title: string;
  onAdd?: () => void;
  addLabel?: string;
  children: React.ReactNode;
  className?: string;
}

const SidebarSection = ({
  title,
  onAdd,
  addLabel,
  children,
  className,
}: SidebarSectionProps) => (
  <SidebarGroup className={className}>
    <SidebarGroupLabel>
      <div className="flex w-full items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {title}
        </span>
        {onAdd && addLabel && <AddButton onClick={onAdd} label={addLabel} />}
      </div>
    </SidebarGroupLabel>
    <SidebarGroupContent>{children}</SidebarGroupContent>
  </SidebarGroup>
);

export const SidebarComponent = () => {
  const workspaceId = useWorkspaceId();
  const projectId = useProjectId();
  const { open: openWorkspace } = useCreateWorkspaceModal();
  const { open: openProject } = useCreateProjectModal();
  const { open: openRoom } = useCreateRoomModal();

  // Memoize the home link to prevent unnecessary re-renders
  const homeLink = useMemo(() => {
    return workspaceId ? `/workspaces/${workspaceId}` : "/";
  }, [workspaceId]);

  // Memoize callbacks to prevent unnecessary re-renders
  const handleOpenWorkspace = useCallback(() => {
    openWorkspace();
  }, [openWorkspace]);

  const handleOpenProject = useCallback(() => {
    openProject();
  }, [openProject]);

  const handleOpenRoom = useCallback(() => {
    openRoom();
  }, [openRoom]);

  // Check if rooms should be shown
  const showRooms = workspaceId && projectId;

  return (
    <Sidebar collapsible="offcanvas" side="left" variant="floating">
      <SidebarContent className="flex flex-col gap-4 p-3">
        {/* Logo Header */}
        <SidebarGroup className="pb-2">
          <SidebarHeader>
            <Link
              href={homeLink}
              className="flex items-center justify-center transition-opacity hover:opacity-80"
              aria-label="Home"
            >
              <Logo className="dark:hidden" />
              <Logo2 className="hidden dark:block" />
            </Link>
          </SidebarHeader>
        </SidebarGroup>

        <Separator className="bg-border" />

        {/* Workspaces Section */}
        <SidebarSection
          title="Workspaces"
          onAdd={handleOpenWorkspace}
          addLabel="Add workspace"
        >
          <WorkspaceSwitcher />
        </SidebarSection>

        {/* Navigation Section */}
        <SidebarSection title="Navigation">
          <Navigation />
        </SidebarSection>

        {/* Projects Section */}
        <SidebarSection
          title="Projects"
          onAdd={handleOpenProject}
          addLabel="Add project"
        >
          <ProjectSwitcher />
        </SidebarSection>

        {/* Rooms Section */}
        <SidebarSection
          title="Rooms"
          onAdd={handleOpenRoom}
          addLabel="Add room"
          className="flex-1"
        >
          <div className="min-h-[60px]">
            {showRooms ? (
              <RoomSwitcher workspaceId={workspaceId} projectId={projectId} />
            ) : (
              <div className="flex h-full items-center justify-center rounded-lg border border-dashed border-muted-foreground/25 px-3 py-4">
                <p className="text-center text-xs text-muted-foreground">
                  Select a project to view rooms
                </p>
              </div>
            )}
          </div>
        </SidebarSection>
      </SidebarContent>
    </Sidebar>
  );
};

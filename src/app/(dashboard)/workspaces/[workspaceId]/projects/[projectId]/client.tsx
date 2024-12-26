"use client";
import { Plus } from "lucide-react";
import { Pencil, UserPlus2 } from "lucide-react";
import Link from "next/link";

import { ProjectAvatar } from "@/features/projects/components/project-avatar";
import { TaskViewSwitcher } from "@/features/tasks/components/task-view-switcher";

import { Button } from "@/components/ui/button";
import { useProjectId } from "@/features/projects/hooks/use-projectId";
import { useGetProject } from "@/features/projects/api/use-get-project";
import { PageLoader } from "@/components/page-loader";
import { PageError } from "@/components/page-error";
import { useGetProjectAnalytics } from "@/features/projects/api/use-get-project-analytics";
import { Analytics } from "@/components/analytics";
import { useAddCollaboratorToProjectModal } from "@/features/projects/hooks/use-add-collaborator-to-project-modal";
import { useCreatePrModal } from "@/features/projects/hooks/use-create-pr-modal";
import { toast } from "sonner";

export const ProjectIdClient = () => {
  const projectId = useProjectId();
  const { data: project, isLoading: projectsLoading } = useGetProject({
    projectId,
  });
  const { data: analytics, isLoading: analyticsLoading } =
    useGetProjectAnalytics({ projectId });

  const handleCreatePr = async () => {
    try {
      await openPr();
    } catch (error) {
      toast.error("You have to push to the specified branch first.");
    }
  }
  const { openPr } = useCreatePrModal();

  const { open } = useAddCollaboratorToProjectModal();

  const isLoading = projectsLoading || analyticsLoading;

  if (isLoading) return <PageLoader />;
  if (!project) return <PageError message="Project not found" />;

  const href = `/workspaces/${project.workspaceId}/projects/${project.$id}/settings`;
  // const canvasHref = `/workspaces/${project.workspaceId}/projects/${project.$id}/canvas/${project.canvasId}`;
  return (
    <div className="flex flex-col gap-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-x-2">
          <ProjectAvatar
            name={project.name}
            image={project.imageUrl}
            className="size-8"
          />
          <p className="text-lg font-semibold">{project.name}</p>
        </div>
        <div className="space-x-4 flex items-center">
          <Button onClick={handleCreatePr} variant={"outline"} size={"sm"}>
            Create Pull Request
            <Plus className="size-1 mr-1" />
          </Button>
          <Button variant={"outline"} size={"sm"} onClick={open}>
            <UserPlus2 className="size-4" />
            Add Collaborator
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link href={href}>
              <Pencil className="size-4" />
              Edit Project
            </Link>
          </Button>
        </div>
      </div>
      {analytics ? <Analytics data={analytics} /> : null}
      <TaskViewSwitcher hideProjectFilter />
    </div>
  );
};

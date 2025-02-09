"use client";
import {
  Pencil,
  UserPlus2,
  GitPullRequestCreateArrowIcon,
  EllipsisVertical,
} from "lucide-react";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
      console.log(error);
      toast.error("You have to push to the specified branch first.");
    }
  };
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
        <div className="hidden md:block">
          <div className="space-x-4 flex items-center">
            <Button onClick={handleCreatePr} variant={"outline"} size={"sm"}>
              <GitPullRequestCreateArrowIcon className="size-4" />
              Create Pull Request
            </Button>
            <Button variant={"default"} size={"sm"} onClick={open}>
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
        <div className="md:hidden block">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size={"icon"} className="lg:hidden">
                <EllipsisVertical className="size-2 " />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="p-2">
              <div className="space-y-2 flex flex-col items-center">
                <Button
                  className="w-full"
                  onClick={handleCreatePr}
                  variant={"outline"}
                  size={"sm"}
                >
                  <GitPullRequestCreateArrowIcon className="size-4" />
                  Create Pull Request
                </Button>
                <Button
                  className="w-full bg-slate-200 hover:bg-slate-300 text-black"
                  variant={"default"}
                  size={"sm"}
                  onClick={open}
                >
                  <UserPlus2 className="size-4" />
                  Add Collaborator
                </Button>
                <Button className="w-full" variant="outline" size="sm" asChild>
                  <Link href={href}>
                    <Pencil className="size-4" />
                    Edit Project
                  </Link>
                </Button>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      {analytics ? <Analytics data={analytics} /> : null}
      <TaskViewSwitcher hideProjectFilter />
    </div>
  );
};

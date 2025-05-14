"use client";
import {
  UserPlus2,
  GitPullRequestCreateArrowIcon,
  EllipsisVertical,
  Settings,
  UploadIcon,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

import { ProjectAvatar } from "@/features/projects/components/project-avatar";
import { TaskViewSwitcher } from "@/features/issues/components/task-view-switcher";
import { Button } from "@/components/ui/button";
import { useProjectId } from "@/features/projects/hooks/use-projectId";
import { useGetProject } from "@/features/projects/api/use-get-project";
import { Loader } from "@/components/page-loader";
import { PageError } from "@/components/page-error";
import { useGetProjectAnalytics } from "@/features/projects/api/use-get-project-analytics";
import { Analytics } from "@/components/analytics";
import { useAddCollaboratorToProjectModal } from "@/features/projects/hooks/use-add-collaborator-to-project-modal";
import { useCreatePrModal } from "@/features/projects/hooks/use-create-pr-modal";
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

  // Move hook calls before their usage to follow React rules of hooks
  const { openPr } = useCreatePrModal();
  const { open } = useAddCollaboratorToProjectModal();

  const handleCreatePr = async () => {
    try {
      await openPr();
    } catch (error) {
      console.error("Error creating pull request:", error);
      toast.error(
        typeof error === "string"
          ? error
          : "You have to push to the specified branch first.",
      );
    }
  };

  const isLoading = projectsLoading || analyticsLoading;

  if (isLoading) return <Loader />;
  if (!project) return <PageError message="Project not found" />;

  const href = `/workspaces/${project.workspaceId}/projects/${project.$id}/settings`;

  return (
    <div className="flex flex-col gap-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-x-2">
          <ProjectAvatar
            name={project.name}
            image={project.imageUrl}
            className="size-8"
          />
          <p className="text-lg font-semibold capitalize">{project.name}</p>
        </div>
        {/* Desktop view */}
        <div className="hidden md:block">
          <div className="flex items-center space-x-4">
            <Button
              className="bg-slate-200 text-black hover:bg-slate-300"
              onClick={handleCreatePr}
              variant={"default"}
              size={"sm"}
            >
              <UploadIcon className="mr-1 size-4" />
              Upload Readme
            </Button>
            <Button
              className="bg-slate-200 text-black hover:bg-slate-300"
              onClick={handleCreatePr}
              variant={"default"}
              size={"sm"}
            >
              <GitPullRequestCreateArrowIcon className="size-4" />
              Create Pull Request
            </Button>
            <Button variant={"outline"} size={"sm"} onClick={open}>
              <UserPlus2 className="size-4" />
              Add Collaborator
            </Button>
            <Button
              className="bg-slate-200 text-black hover:bg-slate-300"
              variant={"default"}
              size="sm"
              asChild
            >
              <Link href={href}>
                <Settings className="size-4" />
                Settings
              </Link>
            </Button>
          </div>
        </div>
        {/* Mobile view */}
        <div className="block md:hidden">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size={"icon"}>
                <EllipsisVertical className="size-4" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52 p-2">
              <div className="flex flex-col items-stretch space-y-2">
                <Button
                  className="bg-slate-200 text-black hover:bg-slate-300"
                  onClick={handleCreatePr}
                  variant={"default"}
                  size={"sm"}
                >
                  <UploadIcon className="mr-1 size-4" />
                  Upload Readme
                </Button>
                <Button
                  className="w-full justify-start bg-slate-200 text-black hover:bg-slate-300"
                  onClick={handleCreatePr}
                  variant={"default"}
                >
                  <GitPullRequestCreateArrowIcon className="size-4" />
                  Create Pull Request
                </Button>
                <Button
                  className="w-full justify-start"
                  variant={"outline"}
                  onClick={open}
                >
                  <UserPlus2 className="size-4" />
                  Add Collaborator
                </Button>
                <Button
                  className="w-full justify-start bg-slate-200 text-black hover:bg-slate-300"
                  variant={"default"}
                  asChild
                >
                  <Link href={href}>
                    <Settings className="size-4" />
                    Settings
                  </Link>
                </Button>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      {analytics && <Analytics data={analytics} />}
      <TaskViewSwitcher hideProjectFilter />
    </div>
  );
};

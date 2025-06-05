"use client";
import {
  UserPlus2,
  GitPullRequestCreateArrowIcon,
  EllipsisVertical,
  Settings,
} from "lucide-react";
import Link from "next/link";

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
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { FaGithub } from "react-icons/fa";
import { headers } from "next/headers";

export const ProjectIdClient = () => {
  const router = useRouter();
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
  const origin = headers().get("origin") ?? "";
  if (!origin) {
    toast.error("Origin header is not available.");
    return null;
  }
  const handlePayment = async () => {
    router.push(`${origin}/paymentPage`);
  };

  const { openPr } = useCreatePrModal();

  const { open } = useAddCollaboratorToProjectModal();

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
          <a
            href={`https://github.com/your-org/${project.name}`}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-1 text-gray-500 hover:text-white"
            title="View on GitHub"
          >
            <FaGithub className="size-5" />
          </a>
        </div>
        <div className="hidden md:block">
          <div className="flex items-center space-x-4">
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
        <div className="block md:hidden">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size={"icon"} className="lg:hidden">
                <EllipsisVertical className="size-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="p-2">
              <div className="flex flex-col items-center space-y-2">
                <Button
                  className="w-full bg-slate-200 text-black hover:bg-slate-300"
                  onClick={handleCreatePr}
                  variant={"default"}
                >
                  <GitPullRequestCreateArrowIcon className="size-4" />
                  Create Pull Request
                </Button>
                <Button
                  className="w-full"
                  variant={"outline"}
                  onClick={handlePayment}
                >
                  <UserPlus2 className="size-4" />
                  Subscribe
                </Button>
                <Button className="w-full" variant={"outline"} onClick={open}>
                  <UserPlus2 className="size-4" />
                  Add Collaborator
                </Button>
                <Button
                  className="w-full bg-slate-200 text-black hover:bg-slate-300"
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
      {analytics ? <Analytics data={analytics} /> : null}
      <TaskViewSwitcher hideProjectFilter />
    </div>
  );
};

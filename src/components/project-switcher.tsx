"use client";

import { useRouter } from "next/navigation";
import { RiAddCircleFill } from "react-icons/ri";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
// import { useGetProjects } from "@/features/projects/api/use-get-projects";
import { useCreateProjectModal } from "@/features/projects/hooks/use-create-project-modal";
import { useProjectId } from "@/features/projects/hooks/use-projectId";
import { ProjectAvatar } from "@/features/projects/components/project-avatar";
import { Project } from "@/features/projects/types";
import { cn } from "@/lib/utils";
import { useGetSpecificProjects } from "@/features/projects/api/use-get-specific-projects";

export const ProjectSwitcher = () => {
  const workspaceId = useWorkspaceId();
  const router = useRouter();
  const projectId = useProjectId();
  const { open } = useCreateProjectModal();
  // const { data: projects } = useGetProjects({ workspaceId });
  const { data: specificProjects } = useGetSpecificProjects({ workspaceId });
  const onSelect = (id: string) => {
    router.push(`/workspaces/${workspaceId}/projects/${id}`);
  };

  return (
    <div className="flex flex-col gap-y-2">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">
          Projects
        </p>
        <RiAddCircleFill
          onClick={open}
          className="size-5 cursor-pointer text-gray-500 transition hover:opacity-75 dark:text-gray-400"
        />
      </div>
      <Select onValueChange={onSelect} value={projectId}>
        <SelectTrigger className="w-full bg-slate-100 p-1 font-medium dark:bg-slate-800">
          <SelectValue placeholder="Select a project" className="font-bold" />
        </SelectTrigger>
        <SelectContent position="popper" className="">
          {specificProjects &&
            typeof specificProjects === "object" &&
            "documents" in specificProjects &&
            Array.isArray(specificProjects.documents) &&
            specificProjects.documents.map((project: Project) => (
              <SelectItem
                className={cn(
                  "m-0.5 hover:bg-slate-200 dark:hover:bg-slate-600",
                  projectId === project.$id && "bg-slate-100 dark:bg-slate-500",
                )}
                value={project.$id}
                key={project.$id}
              >
                <div className="flex items-center justify-start gap-3 font-medium">
                  <ProjectAvatar name={project.name} image={project.imageUrl} />
                  <span className="truncate capitalize">{project.name}</span>
                </div>
              </SelectItem>
            ))}
        </SelectContent>
      </Select>
    </div>
  );
};

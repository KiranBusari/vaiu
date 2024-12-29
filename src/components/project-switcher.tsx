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
import { useGetProjects } from "@/features/projects/api/use-get-projects";
import { useCreateProjectModal } from "@/features/projects/hooks/use-create-project-modal";
import { useProjectId } from "@/features/projects/hooks/use-projectId";
import { ProjectAvatar } from "@/features/projects/components/project-avatar";

export const ProjectSwitcher = () => {
  const workspaceId = useWorkspaceId();
  const router = useRouter();
  const projectId = useProjectId();
  const { open } = useCreateProjectModal();
  const { data: projects } = useGetProjects({ workspaceId });

  const onSelect = (id: string) => {
    router.push(`/workspaces/${workspaceId}/projects/${id}`);
  };
  return (
    <div className="flex flex-col gap-y-2">
      <div className="flex items-center justify-between">
        <p className="text-xs uppercase text-gray-500 dark:text-gray-400 font-semibold">
          Projects
        </p>
        <RiAddCircleFill
          onClick={open}
          className="size-5 text-gray-500 dark:text-gray-400 cursor-pointer hover:opacity-75 transition"
        />
      </div>
      <Select onValueChange={onSelect} value={projectId}>
        <SelectTrigger className="w-full bg-slate-200 dark:bg-gray-800 font-medium p-1">
          <SelectValue placeholder="No project (repo) selected" />
        </SelectTrigger>
        <SelectContent>
          {projects?.documents.map((project) => (
            <SelectItem value={project.$id} key={project.$id}>
              <div className="flex justify-start items-center gap-3 font-medium">
                <ProjectAvatar name={project.name} image={project.imageUrl} />
                <span className="truncate">{project.name}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

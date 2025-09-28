"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { RiAddCircleFill } from "react-icons/ri";

import { cn } from "@/lib/utils";
import { useGetProjects } from "@/features/projects/api/use-get-projects";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { useCreateProjectModal } from "@/features/projects/hooks/use-create-project-modal";
import { ProjectAvatar } from "@/features/projects/components/project-avatar";

export const Projects = () => {
  const pathname = usePathname();
  const workspaceId = useWorkspaceId();

  const { open } = useCreateProjectModal();
  const { data } = useGetProjects({ workspaceId });

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
      {data?.documents.map((project) => {
        const href = `/workspaces/${workspaceId}/projects/${project.$id}`;
        const isActive = pathname === href;
        return (
          <Link href={href} key={project.$id}>
            <div
              className={cn(
                "flex cursor-pointer items-center gap-2.5 rounded-md p-2.5 font-medium text-gray-500 transition hover:opacity-75 dark:text-gray-400",
                isActive &&
                  "bg-white text-gray-100 text-primary shadow-sm hover:opacity-100 dark:bg-gray-800",
              )}
            >
              <ProjectAvatar image={project.imageUrl} name={project.name} />
              <span className="truncate">{project.name}</span>
            </div>
          </Link>
        );
      })}
    </div>
  );
};

"use client";

import { CalendarIcon, PlusIcon, SettingsIcon } from "lucide-react";
import Link from "next/link";
import { Issue } from "@/features/issues/types";
import { formatDistanceToNow } from "date-fns";
import { Button } from "@/components/ui/button";
import { Member } from "@/features/members/types";
import { Analytics } from "@/components/analytics";
import { Project } from "@/features/projects/types";
import { PageError } from "@/components/page-error";
import { Loader } from "@/components/page-loader";
import { Card, CardContent } from "@/components/ui/card";
import { DottedSeparator } from "@/components/dotted-separator";
import { useGetIssues } from "@/features/issues/api/use-get-tasks";
import { useGetMembers } from "@/features/members/api/use-get-members";
import { useGetProjects } from "@/features/projects/api/use-get-projects";
import { MemberAvatar } from "@/features/members/components/members-avatar";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { ProjectAvatar } from "@/features/projects/components/project-avatar";
import { useCreateTaskModal } from "@/features/issues/hooks/use-create-task-modal";
import { useCreateProjectModal } from "@/features/projects/hooks/use-create-project-modal";
import { useGetWorkspaceAnalytics } from "@/features/workspaces/api/use-get-workspace-analytics";

export const WorkspaceIdClient = () => {
  const workspaceId = useWorkspaceId();
  const { data: analytics, isLoading: analyticsLoading } =
    useGetWorkspaceAnalytics({ workspaceId });
  const { data: tasks, isLoading: tasksLoading } = useGetIssues({
    workspaceId,
  });
  const { data: projects, isLoading: projectsLoading } = useGetProjects({
    workspaceId,
  });
  const { data: members, isLoading: membersLoading } = useGetMembers({
    workspaceId,
  });

  const isLoading =
    analyticsLoading || tasksLoading || projectsLoading || membersLoading;

  if (isLoading) return <Loader />;

  if (!analytics || !tasks || !projects || !members)
    return <PageError message="Failed to load workspace data" />;
  return (
    <div className="flex h-full flex-col space-y-4">
      <Analytics data={analytics} />
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <TaskList data={tasks.documents} total={tasks.total} />
        <ProjectList data={projects.documents} total={projects.total} />
        <MembersList data={members.documents} total={members.total} />
      </div>
    </div>
  );
};

interface TaskListProps {
  data: Issue[];
  total: number;
}
export const TaskList = ({ data, total }: TaskListProps) => {
  const { open: createTask } = useCreateTaskModal();
  const workspaceId = useWorkspaceId();

  return (
    <div className="col-span-1 flex flex-col gap-y-4">
      <div className="rounded-lg border bg-slate-200 p-4 dark:bg-gray-800">
        <div className="flex items-center justify-between">
          <p className="text-lg font-semibold">Issues ({total})</p>
          <Button variant="secondary" size="icon" onClick={createTask}>
            <PlusIcon className="size-4 text-gray-400" />
          </Button>
        </div>
        <DottedSeparator className="my-4" />
        <ul className="flex flex-col gap-y-4">
          {data.map((issue) => (
            <li key={issue.$id}>
              <Link
                href={`/workspaces/${workspaceId}/projects/${issue.projectId}/tasks/${issue.$id}`}
              >
                <Card className="rounded-lg bg-slate-50 shadow-none transition hover:opacity-75 dark:bg-gray-900">
                  <CardContent className="p-4">
                    <p className="truncate text-lg font-medium">{issue.name}</p>
                    <div className="flex items-center gap-x-2">
                      <p>{issue.project?.name}</p>
                      <div className="dot" />
                      <div className="flex items-center text-sm text-muted-foreground">
                        <CalendarIcon className="mr-1 size-3" />
                        <span className="truncate">
                          {formatDistanceToNow(new Date(issue.dueDate))}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </li>
          ))}
          <li className="hidden text-center text-sm text-muted-foreground first-of-type:block">
            No issues found
          </li>
        </ul>
        <Button
          variant="outline"
          className="mt-4 w-full bg-slate-100 transition-all duration-300 ease-in-out dark:bg-gray-900"
          asChild
        >
          <Link href={`/workspaces/${workspaceId}/issues`}>Show All</Link>
        </Button>
      </div>
    </div>
  );
};

interface ProjectListProps {
  data: Project[];
  total: number;
}
export const ProjectList = ({ data, total }: ProjectListProps) => {
  const { open: createProject } = useCreateProjectModal();
  const workspaceId = useWorkspaceId();

  return (
    <div className="col-span-1 flex flex-col gap-y-4">
      <div className="rounded-lg border bg-slate-200 p-4 dark:bg-gray-800">
        <div className="flex items-center justify-between">
          <p className="text-lg font-semibold">Projects ({total})</p>
          <Button variant="secondary" size="icon" onClick={createProject}>
            <PlusIcon className="size-4 text-neutral-400" />
          </Button>
        </div>
        <DottedSeparator className="my-4" />
        <ul className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {data.map((project) => (
            <li key={project.$id}>
              <Link href={`/workspaces/${workspaceId}/projects/${project.$id}`}>
                <Card className="rounded-lg border border-gray-200 bg-slate-50 shadow-none transition hover:opacity-75 dark:border-gray-700 dark:bg-gray-900">
                  <CardContent className="flex items-center gap-x-2.5 p-4">
                    <ProjectAvatar
                      className="size-12"
                      fallbackClassName="text-lg"
                      name={project.name}
                      image={project.imageUrl}
                    />
                    <p className="truncate text-lg font-medium">
                      {project.name}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            </li>
          ))}
          <li className="hidden text-center text-sm text-muted-foreground first-of-type:block">
            No projects found
          </li>
        </ul>
      </div>
    </div>
  );
};

interface MembersListProps {
  data: Member[];
  total: number;
}
export const MembersList = ({ data, total }: MembersListProps) => {
  const workspaceId = useWorkspaceId();

  return (
    <div className="container col-span-1 flex flex-col gap-y-4">
      <div className="rounded-lg border bg-slate-200 p-4 dark:bg-gray-800">
        <div className="flex items-center justify-between">
          <p className="text-lg font-semibold">Members ({total})</p>
          <Button asChild variant="secondary" size="icon">
            <Link href={`/workspaces/${workspaceId}/members`}>
              <SettingsIcon className="size-4 text-neutral-400" />
            </Link>
          </Button>
        </div>
        <DottedSeparator className="my-4" />
        <ul className="grid grid-cols-1 place-items-center gap-2 md:grid-cols-2">
          {data && data.length > 0 ? (
            <>
              {data.map((member) => (
                <li key={member.$id} className="flex w-fit gap-4">
                  <Card className="overflow-hidden rounded-lg border border-gray-200 bg-slate-50 shadow-none dark:border-gray-700 dark:bg-gray-900">
                    <CardContent className="flex flex-col items-center gap-x-2 p-2">
                      <MemberAvatar className="size-12" name={member.name} />
                      <div className="flex flex-col items-center overflow-hidden p-2">
                        <p className="line-clamp-1 max-w-36 text-lg font-medium">
                          {member.name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {member.email}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </li>
              ))}
            </>
          ) : (
            <li className="hidden text-center text-sm text-muted-foreground first-of-type:block">
              No members found
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};

import { MoreHorizontalIcon } from "lucide-react";
import { Issue } from "../types";
import { TaskActions } from "./task-actions";
import { DottedSeparator } from "@/components/dotted-separator";
import { MemberAvatar } from "@/features/members/components/members-avatar";
import { TaskDate } from "./task-date";
import { ProjectAvatar } from "@/features/projects/components/project-avatar";

interface KanbanCardProps {
  issue: Issue;
}

export const KanbanCard = ({ issue }: KanbanCardProps) => {
  return (
    <div className="mb-1.5 space-y-3 rounded bg-gray-100 p-2.5 shadow-md dark:bg-gray-900">
      <div className="flex items-start justify-between gap-x-2">
        <p className="line-clamp-2">{issue.name}</p>
        <TaskActions id={issue.$id} projectId={issue.projectId}>
          <MoreHorizontalIcon className="size-[18px] shrink-0 stroke-1 text-neutral-700 transition hover:opacity-75" />
        </TaskActions>
      </div>
      <DottedSeparator />
      <div className="flex items-center gap-x-1.5">
        <MemberAvatar
          name={issue?.assignee?.name || "No Assignee"}
          fallbackClassName="text-[10px]"
        />
        <div className="dot" />
        <TaskDate value={issue.dueDate} className="text-xs" />
      </div>
      <div className="flex items-center gap-x-1.5">
        <ProjectAvatar
          name={issue.project.name}
          image={issue.project.imageUrl}
          fallbackClassName="text-[10px]"
        />
        <span className="text-xs font-medium">{issue.project.name}</span>
      </div>
    </div>
  );
};

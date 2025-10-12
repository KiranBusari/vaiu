import {
  PlusIcon,
  CircleDotIcon,
  CircleCheckIcon,
  CircleDashedIcon,
  CircleDotDashedIcon,
  CircleIcon,
} from "lucide-react";
import { snakeCaseToTitleCase } from "@/lib/utils";
import { IssueStatus } from "../types";
import React from "react";
import { Button } from "@/components/ui/button";
import { useCreateTaskModal } from "../hooks/use-create-task-modal";

interface KanbanColumnHeaderProps {
  board: IssueStatus;
  taskCount: number;
}

const statusIconMap: Record<IssueStatus, React.ReactNode> = {
  [IssueStatus.BACKLOG]: <CircleDashedIcon className="size-4 text-pink-500" />,
  [IssueStatus.TODO]: <CircleIcon className="size-4 text-rose-500" />,
  [IssueStatus.DONE]: <CircleCheckIcon className="size-4 text-emerald-500" />,
  [IssueStatus.IN_PROGRESS]: (
    <CircleDotDashedIcon className="size-4 text-yellow-500" />
  ),
  [IssueStatus.IN_REVIEW]: <CircleDotIcon className="size-4 text-blue-500" />,
};

const statusColorMap: Record<IssueStatus, string> = {
  [IssueStatus.BACKLOG]:
    "bg-pink-100 text-pink-700 dark:bg-pink-950 dark:text-pink-300",
  [IssueStatus.TODO]:
    "bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300",
  [IssueStatus.DONE]:
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
  [IssueStatus.IN_PROGRESS]:
    "bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300",
  [IssueStatus.IN_REVIEW]:
    "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
};

export const KanbanColumnHeader = ({
  board,
  taskCount,
}: KanbanColumnHeaderProps) => {
  const { open } = useCreateTaskModal();
  const icon = statusIconMap[board];
  const colorClass = statusColorMap[board];

  return (
    <div className="sticky top-0 z-10 border-b bg-background/95 px-3 py-3 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-x-2">
          {icon}
          <h2 className="text-sm font-semibold">
            {snakeCaseToTitleCase(board)}
          </h2>
          <div
            className={`flex h-5 min-w-[20px] items-center justify-center rounded-full px-1.5 text-xs font-semibold ${colorClass}`}
          >
            {taskCount}
          </div>
        </div>
        <Button
          onClick={open}
          variant="ghost"
          size="icon"
          className="h-7 w-7 hover:bg-muted"
        >
          <PlusIcon className="size-4" />
        </Button>
      </div>
    </div>
  );
};

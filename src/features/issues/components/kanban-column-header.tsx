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
  [IssueStatus.BACKLOG]: (
    <CircleDashedIcon className="size=[18px] text-pink-400" />
  ),
  [IssueStatus.TODO]: <CircleIcon className="size=[18px] text-rose-400" />,
  [IssueStatus.DONE]: (
    <CircleCheckIcon className="size=[18px] text-emerald-400" />
  ),
  [IssueStatus.IN_PROGRESS]: (
    <CircleDotDashedIcon className="size=[18px] text-yellow-400" />
  ),
  [IssueStatus.IN_REVIEW]: (
    <CircleDotIcon className="size=[18px] text-neutral-400" />
  ),
};
export const KanbanColumnHeader = ({
  board,
  taskCount,
}: KanbanColumnHeaderProps) => {
  const { open } = useCreateTaskModal();
  const icon = statusIconMap[board];
  return (
    <div className="flex items-center justify-between px-2 py-1.5">
      <div className="flex items-center gap-x-2">
        {icon}
        <h2 className="text-sm font-medium">{snakeCaseToTitleCase(board)}</h2>
        <div className="flex size-5 items-center justify-center rounded-md bg-neutral-200 text-xs font-medium text-neutral-700">
          {taskCount}
        </div>
      </div>
      <Button className="size-5" onClick={open} variant="ghost" size="icon">
        <PlusIcon className="size-4 text-neutral-500" />
      </Button>
    </div>
  );
};

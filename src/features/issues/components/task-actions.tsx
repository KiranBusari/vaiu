import { useRouter } from "next/navigation";
import { ExternalLinkIcon, PencilIcon, TrashIcon, Brain, Loader2 } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useConfirm } from "@/hooks/use-confirm";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";

import { useDeleteTask } from "../api/use-delete-task";
import { useEditTaskModal } from "../hooks/use-update-task-modal";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AISummaryCard } from "@/features/ai-summaries/components/ai-summary-card";
import { useGenerateAISummary } from "@/features/ai-summaries/api/use-generate-ai-summary";
import { useGetTask } from "../api/use-get-task";
import { useState } from "react";
interface TaskActionsProps {
  id: string;
  projectId: string;
  children: React.ReactNode;
}

export const TaskActions = ({ children, id, projectId }: TaskActionsProps) => {
  const [showAISummary, setShowAISummary] = useState(false);
  const { data: taskData } = useGetTask({ issueId: id });
  const { mutate: generateSummary, isPending: isSummaryPending } = useGenerateAISummary();

  const handleAISummary = () => {
    setShowAISummary(true);
  };

  const router = useRouter();
  const workspaceId = useWorkspaceId();
  const { open } = useEditTaskModal();
  const [ConfirmDialog, confirm] = useConfirm(
    "Delete Task",
    "Are you sure you want to delete this task?",
    "destructive",
  );
  const { mutate, isPending } = useDeleteTask();
  const onDelete = async () => {
    const ok = await confirm();
    if (!ok) return;
    mutate({ param: { issueId: id } });
  };

  const onOpenTask = () => {
    router.push(`/workspaces/${workspaceId}/projects/${projectId}/tasks/${id}`);
  };
  const onOpenProject = () => {
    router.push(`/workspaces/${workspaceId}/projects/${projectId}`);
  };
  return (
    <div className="flex justify-end">
      <ConfirmDialog />
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48 text-sm">
          <DropdownMenuItem
            onClick={onOpenTask}
            className="p-[10px] text-sm font-medium"
          >
            <ExternalLinkIcon className="sroke-2 mr-2 size-4" />
            Issue Details
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={onOpenProject}
            className="p-[10px] font-medium"
          >
            <ExternalLinkIcon className="sroke-2 mr-2 size-4" />
            Open Project
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => open(id)}
            className="p-[10px] font-medium"
          >
            <PencilIcon className="sroke-2 mr-2 size-4" />
            Edit Task
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={onDelete}
            disabled={isPending}
            className="p-[10px] font-medium text-amber-700 focus:text-amber-700"
          >
            <TrashIcon className="sroke-2 mr-2 size-4" />
            Delete Task
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={handleAISummary}
            disabled={isSummaryPending}
            className="p-[10px] font-medium"
          >
            {isSummaryPending ? (
              <Loader2 className="sroke-2 mr-2 size-4 animate-spin" />
            ) : (
              <Brain className="sroke-2 mr-2 size-4" />
            )}
            AI Summary
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <Dialog open={showAISummary} onOpenChange={setShowAISummary}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>AI Summary</DialogTitle>
          </DialogHeader>
          <AISummaryCard
            workspaceId={workspaceId}
            projectId={projectId}
            type="issue"
            identifier={taskData?.number || 0}
            title={taskData?.name || ""}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

import { useRouter } from "next/navigation";
import { ExternalLinkIcon, PencilIcon, TrashIcon, Brain, Loader2 } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
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
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const { data: taskData, isLoading: isLoadingTask } = useGetTask({ issueId: id, enabled: showAISummary });
  const { isPending: isSummaryPending } = useGenerateAISummary();

  const handleAISummary = () => {
    setShowAISummary(true);
  };

  const router = useRouter();
  const workspaceId = useWorkspaceId();
  const { open } = useEditTaskModal();
  const { mutate, isPending } = useDeleteTask();

  const onDelete = () => {
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = () => {
    mutate({ param: { issueId: id } });
    setShowDeleteConfirm(false);
  };

  const onOpenTask = () => {
    router.push(`/workspaces/${workspaceId}/projects/${projectId}/tasks/${id}`);
  };
  const onOpenProject = () => {
    router.push(`/workspaces/${workspaceId}/projects/${projectId}`);
  };
  return (
    <div className="flex justify-end">
      <Dialog 
        open={showDeleteConfirm} 
        onOpenChange={(open) => {
          if (!isPending) {
            setShowDeleteConfirm(open);
          }
        }}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Task</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            This action cannot be undone.
          </p>
          <div className="flex justify-end gap-2 pt-4">
            <Button 
              variant="outline" 
              onClick={() => setShowDeleteConfirm(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleConfirmDelete} disabled={isPending}>
              {isPending ? "Deleting..." : "Delete"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

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
          {isLoadingTask ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="size-8 animate-spin text-muted-foreground" />
              <span className="ml-2 text-sm text-muted-foreground">Loading issue data...</span>
            </div>
          ) : taskData?.number ? (
            <AISummaryCard
              workspaceId={workspaceId}
              projectId={projectId}
              type="issue"
              identifier={taskData.number}
              title={taskData.name}
            />
          ) : (
            <div className="py-8 text-center text-sm text-muted-foreground">
              Unable to load issue data
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

import { Card, CardContent } from "@/components/ui/card";
import { useGetMembers } from "@/features/members/api/use-get-members";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { Loader } from "lucide-react";
import { AddCollaboratorToProjectForm } from "./add-collaborator-to-project-form";

interface AddCollaboratorToProjectWrapperProps {
  onCancel?: () => void;
}
export const AddCollaboratorToProjectWrapper = ({
  onCancel,
}: AddCollaboratorToProjectWrapperProps) => {
  const workspaceId = useWorkspaceId();
  const { data: members, isLoading: loadingMembers } = useGetMembers({
    workspaceId: workspaceId,
  });
  const memberOptions = members?.documents.map((project) => ({
    id: project.$id,
    name: project.name,
  }));
  const isLoading = loadingMembers;
  if (isLoading) {
    return (
      <Card className="w-full h-[714px] border-none shadow-none">
        <CardContent className="flex items-center justify-center h-full">
          <Loader className="size-5 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }
  return (
    <AddCollaboratorToProjectForm
      onCancel={onCancel}
      memberOptions={memberOptions ?? []}
    />
  );
};

"use client";

import Link from "next/link";
import { Fragment } from "react";
import { ArrowLeft, MoreVertical } from "lucide-react";

import { Button } from "@/components/ui/button";
import { DottedSeparator } from "@/components/dotted-separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { MemberRole } from "@/features/members/types";
import { useDeleteMember } from "@/features/members/api/use-delete-member";
import { useUpdateMember } from "@/features/members/api/use-update-member";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { MemberAvatar } from "@/features/members/components/members-avatar";
import { useConfirm } from "@/hooks/use-confirm";
import { useProjectId } from "@/features/projects/hooks/use-projectId";
import { useGetProjectMembers } from "../api/use-get-project-members";

export const ProjectMembersList = () => {
  const workspaceId = useWorkspaceId();
  const projectId = useProjectId();
  const [ConfirmDialog, confirm] = useConfirm(
    "Remove Member",
    "This member will be removed from the workspace",
    "destructive",
  );

  const { data } = useGetProjectMembers({ workspaceId, projectId });

  const { mutate: deleteMember, isPending: deletingMember } = useDeleteMember();
  const { mutate: updateMember, isPending: updatingMember } = useUpdateMember();

  const handleUpdateMember = (memberId: string, role: MemberRole) => {
    updateMember({ param: { memberId }, json: { role } });
  };

  const handleDeleteMember = async (memberId: string) => {
    const ok = await confirm();
    if (!ok) return;
    deleteMember(
      { param: { memberId } },
      {
        onSuccess: () => {
          window.location.reload();
        },
      },
    );
  };
  return (
    <Card className="size-full border-none shadow-none">
      <ConfirmDialog />
      <CardHeader className="flex flex-row items-center gap-x-4 space-y-0 p-7">
        <Button asChild variant="secondary" size="sm">
          <Link href={`/workspaces/${workspaceId}/projects/${projectId}`}>
            <ArrowLeft className="mr-2 size-4" />
            Back
          </Link>
        </Button>
        <CardTitle className="text-xl font-bold">
          Project Members List
        </CardTitle>
      </CardHeader>
      <div className="px-7">
        <DottedSeparator />
      </div>
      <CardContent className="p-7">
        {data?.documents.map((member, idx) => (
          <Fragment key={member.$id}>
            <div className="flex items-center gap-2">
              <MemberAvatar
                className="size-10"
                fallbackClassName="text-lg"
                name={member.name}
              />
              <div className="flex flex-col">
                <p className="text-sm font-medium">{member.name}</p>
                <p className="text-xs font-medium">{member.email}</p>
                <p className="text-xs font-semibold text-destructive">
                  {member.role}
                </p>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button className="ml-auto" variant="secondary" size="icon">
                    <MoreVertical className="size-4 text-muted-foreground" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent side="bottom" align="end">
                  <DropdownMenuItem
                    className={`font-medium ${
                      member.role === MemberRole.ADMIN && "hidden"
                    }`}
                    onClick={() =>
                      handleUpdateMember(member.$id, MemberRole.ADMIN)
                    }
                    disabled={updatingMember}
                  >
                    Set as Administrator
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="font-medium"
                    onClick={() =>
                      handleUpdateMember(member.$id, MemberRole.MEMBER)
                    }
                    disabled={updatingMember}
                  >
                    Set as Member
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="font-medium text-amber-700"
                    onClick={() => handleDeleteMember(member.$id)}
                    disabled={deletingMember}
                  >
                    Remove {member.name}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            {idx < data.documents.length - 1 && (
              <Separator className="my-2.5 bg-neutral-400/40" />
            )}
          </Fragment>
        ))}
      </CardContent>
    </Card>
  );
};

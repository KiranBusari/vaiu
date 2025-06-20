"use client";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { DottedSeparator } from "@/components/dotted-separator";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { useJoinProject } from "../api/use-join-project";

interface JoinWorkspaceFormProps {
  initialValues: {
    name: string;
  };
  code: string;
  workspaceId: string;
  projectId: string;
}
export const JoinWorkspaceForm = ({
  initialValues,
  code: inviteCode,
  workspaceId,
  projectId,
}: JoinWorkspaceFormProps) => {
  const router = useRouter();
  const { mutate, isPending } = useJoinProject();

  const onSubmit = () => {
    mutate(
      {
        param: { workspaceId, projectId },
        json: { code: inviteCode },
      },
      {
        onSuccess: ({ data }) => {
          router.push(`/workspaces/${data.workspaceId}/projects/${data.$id}`);
        },
      }
    );
  };

  return (
    <Card className="size-full border-none shadow-none">
      <CardHeader className="p-7">
        <CardTitle className="text-xl font-bold">Join Project</CardTitle>
        <CardDescription>
          You&apos;ve been invited to join <strong>{initialValues.name}</strong>{" "}
          project
        </CardDescription>
      </CardHeader>
      <div className="px-7">
        <DottedSeparator />
      </div>
      <CardContent className="p-7">
        <div className="flex flex-col gap-2 lg:flex-row items-center justify-between">
          <Button
            className="w-full lg:w-fit"
            disabled={isPending}
            variant="secondary"
            type="button"
            size="lg"
            asChild
          >
            <Link href="/">Cancel</Link>
          </Button>
          <Button
            className="w-full lg:w-fit"
            disabled={isPending}
            onClick={onSubmit}
            type="button"
            size="lg"
          >
            Join Project
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

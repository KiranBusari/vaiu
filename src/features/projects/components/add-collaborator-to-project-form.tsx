import React from "react";
import { useProjectId } from "../hooks/use-projectId";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { DottedSeparator } from "@/components/dotted-separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAddCollaboratorToProject } from "../api/use-add-collaborator-to-project";
import { Input } from "@/components/ui/input";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";

interface AddCollaboratorToProjectProps {
  onCancel?: () => void;
}
export const AddCollaboratorToProjectForm = ({
  onCancel,
}: AddCollaboratorToProjectProps) => {
  const workspaceId = useWorkspaceId();
  const projectId = useProjectId();
  const { mutate, isPending } = useAddCollaboratorToProject();

  const router = useRouter();
  const form = useForm({
    defaultValues: {
      username: "",
    },
  });
  const onSubmit = () => {
    mutate(
      {
        json: {
          projectId,
          username: form.getValues("username"),
        },
        param: {
          projectId,
        },
      },
      {
        onSuccess: () => {
          form.reset();
          router.push(`/workspaces/${workspaceId}/projects/${projectId}`);
        },
      }
    );
  };

  return (
    <Card className="size-full border-none shadow-none dark:bg-slate-900 bg-white">
      <CardHeader className="flex p-7">
        <CardTitle className="text-xl font-bold">
          Add New Collaborator
        </CardTitle>
      </CardHeader>
      <div className="px-7">
        <DottedSeparator />
      </div>
      <CardContent className="p-7">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-y-4">
              <FormField
                name="username"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Github Username</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="text"
                        placeholder="Enter Github username"
                        className="border border-zinc-600"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DottedSeparator className="py-7" />
            <div className="flex items-center justify-between">
              <Button
                type="button"
                size="lg"
                variant="secondary"
                onClick={onCancel}
                disabled={isPending}
                className={cn(!onCancel && "invisible") + " bg-slate-200 text-black dark:bg-slate-800 dark:text-white"}
              >
                Cancel
              </Button>
              <Button disabled={isPending} type="submit" size="lg" className="bg-slate-200 text-black hover:hidden dark:bg-slate-800 dark:text-white">
                Add Collaborator
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

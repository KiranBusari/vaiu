import React from "react";
import { useProjectId } from "../hooks/use-projectId";
// import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";

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

interface AddCollaboratorToProjectProps {
  onCancel?: () => void;
}
export const AddCollaboratorToProjectForm = ({
  onCancel,
}: AddCollaboratorToProjectProps) => {
  const projectId = useProjectId();
  const { mutate, isPending } = useAddCollaboratorToProject();
  const form = useForm({
    defaultValues: {
      username: "",
    },
  });
  const onSubmit = () => {
    mutate({
      json: {
        projectId,
        username: form.getValues("username"),
      },
      param: {
        projectId,
      },
    });
  };

  return (
    <Card className="size-full border-none shadow-none">
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
                className={cn(!onCancel && "invisible")}
              >
                Cancel
              </Button>
              <Button disabled={isPending} type="submit" size="lg">
                Add Collaborator
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

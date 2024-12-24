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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { MemberAvatar } from "@/features/members/components/members-avatar";
import { useAddCollaboratorToProject } from "../api/use-add-collaborator-to-project";

interface AddCollaboratorToProjectProps {
  onCancel?: () => void;
  memberOptions: { id: string; name: string }[];
}
export const AddCollaboratorToProjectForm = ({
  onCancel,
  memberOptions,
}: AddCollaboratorToProjectProps) => {
  const projectId = useProjectId();
  console.log(projectId);
  const { mutate, isPending } = useAddCollaboratorToProject();
  const form = useForm({
    defaultValues: {
      assigneeId: "",
    },
  });
  const onSubmit = () => {
    mutate({
      json: {
        projectId,
        assigneeId: form.getValues("assigneeId"),
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
                control={form.control}
                name="assigneeId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Members</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a collaborator" />
                        </SelectTrigger>
                      </FormControl>
                      <FormMessage />
                      <SelectContent>
                        {memberOptions.map((member) => (
                          <SelectItem key={member.id} value={member.id}>
                            <div className="flex items-center gap-x-2">
                              <MemberAvatar
                                className="size-6"
                                name={member.name}
                              />
                              {member.name}
                            </div>
                          </SelectItem>
                        ))}
                        <FormMessage />
                      </SelectContent>
                    </Select>
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

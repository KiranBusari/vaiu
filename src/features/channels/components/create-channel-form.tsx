"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Form,
  FormControl,
  FormField,
  FormLabel,
  FormMessage,
  FormItem,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Separator } from "@/components/ui/separator";
import { RoomSchema } from "../schemas";
import { useCreateRoom } from "../api/use-create-room";
import { cn } from "@/lib/utils";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { RoomType } from "../types";
import { useGetProjects } from "@/features/projects/api/use-get-projects";
import { ProjectAvatar } from "@/features/projects/components/project-avatar";

interface CreateRoomFormProps {
  onCancel?: () => void;
}

const CreateChannelForm = ({ onCancel }: CreateRoomFormProps) => {
  const workspaceId = useWorkspaceId();

  const router = useRouter();

  const { mutate, isPending } = useCreateRoom();

  const { data: projects } = useGetProjects({
    workspaceId: workspaceId,
  });

  const projectOptions = projects?.documents.map((project) => ({
    id: project.$id,
    name: project.name,
    imageUrl: project.imageUrl,
  }));

  const form = useForm<z.infer<typeof RoomSchema>>({
    resolver: zodResolver(RoomSchema),
    defaultValues: {
      name: "",
      roomType: RoomType.AUDIO,
      workspaceId: workspaceId,
    },
  });

  useEffect(() => {
    form.setValue("roomType", RoomType.AUDIO);
  }, [form]);

  const onSubmit = async (values: z.infer<typeof RoomSchema>) => {
    try {
      mutate(
        { json: { ...values, workspaceId } },
        {
          onSuccess: () => {
            form.reset();
            router.push(
              `/workspaces/${workspaceId}/projects/${values.projectId}`,
            );
          },
        },
      );
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Card className="size-full border-none shadow-none">
      <CardHeader className="flex p-7">
        <CardTitle className="text-xl font-bold">Create new Room</CardTitle>
      </CardHeader>
      <div className="px-7">
        <Separator />
      </div>
      <CardContent className="p-7">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Room name</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter room name" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="roomType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Room Type</FormLabel>
                    <Select
                      disabled={isPending}
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="border-0 bg-zinc-300 capitalize text-black outline-none ring-offset-0 focus:ring-0 focus-visible:ring-offset-0">
                          <SelectValue placeholder="Select a room type" />
                        </SelectTrigger>
                      </FormControl>

                      <SelectContent>
                        {Object.values(RoomType).map((type) => (
                          <SelectItem
                            key={type}
                            value={type}
                            className="cursor-pointer capitalize"
                          >
                            {type.toLowerCase()}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="projectId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Select a project</FormLabel>
                    <Select
                      disabled={isPending}
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="border-0 bg-zinc-300 capitalize text-black outline-none ring-offset-0 focus:ring-0 focus-visible:ring-offset-0">
                          <SelectValue placeholder="Select a project" />
                        </SelectTrigger>
                      </FormControl>

                      <SelectContent>
                        {projectOptions?.map((project) => (
                          <SelectItem key={project.id} value={project.id}>
                            <div className="flex cursor-pointer items-center gap-x-2">
                              <ProjectAvatar
                                image={project.imageUrl}
                                className="size-6"
                                name={project.name}
                              />
                              {project.name}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Separator className="py-7" />
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
                Create Room
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default CreateChannelForm;

"use client";
import { useRef } from "react";
import Image from "next/image";
import { ImageIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";

import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

import { useCreateWorkspace } from "../api/use-create-workspace";

import { type CreateWorkspaceSchema, createWorkspaceSchema } from "../schemas";

interface CreateWorkspaceFormProps {
  onCancel?: () => void;
}

export const CreateWorkspaceForm = ({ onCancel }: CreateWorkspaceFormProps) => {
  const router = useRouter();
  const { mutate, isPending } = useCreateWorkspace();
  const inputRef = useRef<HTMLInputElement>(null);
  const form = useForm<CreateWorkspaceSchema>({
    resolver: zodResolver(createWorkspaceSchema),
    defaultValues: {
      name: "",
    },
  });
  const onSubmit = (values: CreateWorkspaceSchema) => {
    const finalValues = {
      ...values,
      image: values.image instanceof File ? values.image : "",
    };
    mutate(
      { form: finalValues },
      {
        onSuccess: ({ data }) => {
          form.reset();
          router.push(`/workspaces/${data.$id}`);
        },
      },
    );
  };
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue("image", file);
    }
  };

  return (
    <Card className="size-full border-none shadow-none dark:bg-slate-800">
      <CardHeader className="flex p-7">
        <CardTitle className="text-xl font-bold">
          Create new workspace
        </CardTitle>
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
                    <FormLabel>Workspace name</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Enter workspace name"
                        className="border border-slate-200"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <div className="flex flex-col gap-y-2">
                    <div className="flex items-center gap-x-5">
                      {field.value ? (
                        <div className="relative size-[72px] overflow-hidden rounded-md">
                          <Image
                            fill
                            src={
                              field.value instanceof File
                                ? URL.createObjectURL(field.value)
                                : field.value
                            }
                            alt="Workspace Icon"
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <Avatar className="size-[72px]">
                          <AvatarFallback className="bg-slate-200 dark:bg-gray-800">
                            <ImageIcon className="size-[36px] text-black dark:text-gray-200" />
                          </AvatarFallback>
                        </Avatar>
                      )}
                      <div className="flex flex-col">
                        <p className="text-sm">Workspace Icon</p>
                        <p className="text-sm text-muted-foreground">
                          JPEG, PNG, SVG, or JPEG, max 1 mb
                        </p>
                        <input
                          hidden
                          type="file"
                          ref={inputRef}
                          disabled={isPending}
                          onChange={handleImageChange}
                          accept=".jpg, .jpeg, .png, .svg"
                        />
                        {field.value ? (
                          <Button
                            size="sm"
                            type="button"
                            variant="destructive"
                            className="dark:gray-200 mt-2 w-fit bg-slate-200 hover:bg-slate-300 dark:bg-gray-800"
                            disabled={isPending}
                            onClick={() => {
                              field.onChange(null);
                              if (inputRef.current) inputRef.current.value = "";
                            }}
                          >
                            Remove Icon
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            type="button"
                            variant="secondary"
                            className="dark:gray-200 mt-2 w-fit bg-slate-200 hover:bg-slate-300 dark:bg-gray-800"
                            disabled={isPending}
                            onClick={() => inputRef.current?.click()}
                          >
                            Upload Icon
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
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
                className={
                  cn(!onCancel && "invisible") +
                  "text-black dark:bg-gray-800 dark:text-gray-100"
                }
              >
                Cancel
              </Button>
              <Button
                disabled={isPending}
                type="submit"
                size="lg"
                className="bg-slate-200 text-black hover:bg-slate-300 dark:bg-gray-800 dark:text-gray-100"
              >
                Create workspace
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

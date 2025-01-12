"use client";
import { useRef } from "react";
import Image from "next/image";
import { ImageIcon, Info } from "lucide-react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";

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
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { cn } from "@/lib/utils";

import { useCreateProject } from "../api/use-create-project";
import {
  addExistingProjectSchema,
  AddExistingProjectSchema,
  type CreateProjectSchema,
  createProjectSchema,
} from "../schemas";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import { Zoom } from "@/components/ui/zoom";
import { Steps } from "@/components/ui/steps";
import { useAddExistingProject } from "../api/use-add-existing-project";

interface CreateProjectFormProps {
  onCancel?: () => void;
}

const TokenSetupGuide = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [imagePreview, setImagePreview] = useState("");

  const steps = [
    {
      title: "Navigate to Settings",
      images: ["/step1.png"],
      description: "Go to GitHub settings page",
    },
    {
      title: "Access Developer Settings",
      images: ["/step2.png"],
      description: "Click on Developer Settings in the sidebar",
    },
    {
      title: "Personal Access Tokens",
      images: ["/step3.png"],
      description: "Select Personal Access Tokens",
    },
    {
      title: "Generate Token",
      images: ["/step4.png"],
      description: "Click on Generate new token and enter details",
    },
    {
      title: "Set Permissions",
      images: ["/scope1.png", "/scope2.png", "/scope3.png"],
      description: "Define the required scopes",
    },
  ];

  return (
    <div className="w-full max-w-3xl mx-auto p-4">
      <Tabs defaultValue="steps" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="steps">Step by Step Guide</TabsTrigger>
          <TabsTrigger value="quick">Quick Overview</TabsTrigger>
        </TabsList>

        <TabsContent value="steps">
          <Steps
            currentStep={currentStep}
            steps={steps}
            onStepClick={setCurrentStep}
          />

          <div className="mt-6 space-y-4">
            <h3 className="text-xl font-semibold">
              {steps[currentStep].title}
            </h3>
            <p className="text-lg text-gray-700">
              {steps[currentStep].description}
            </p>
            <div className="grid grid-cols-2 gap-4">
              {steps[currentStep].images.map((image, idx) => (
                <div key={idx} className="relative group">
                  <Image
                    src={image}
                    alt={`${steps[currentStep].title} - Image ${idx + 1}`}
                    width={280}
                    height={200}
                    className="rounded-lg border cursor-zoom-in transition-transform hover:scale-[1.02]"
                    onClick={() => setImagePreview(image)}
                  />
                  <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors" />
                </div>
              ))}
            </div>

            <div className="flex justify-between mt-4">
              <Button
                variant="outline"
                disabled={currentStep === 0}
                onClick={() => setCurrentStep((prev) => prev - 1)}
              >
                Previous
              </Button>
              <Button
                disabled={currentStep === steps.length - 1}
                onClick={() => setCurrentStep((prev) => prev + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="quick">
          <div className="grid grid-cols-2 gap-4">
            {steps.map((step, index) => (
              <div
                key={index}
                className="p-4 border rounded-lg hover:shadow-md transition-shadow"
              >
                <h4 className="font-medium mb-2">{step.title}</h4>
                <div className="grid grid-cols-2 gap-2">
                  {step.images.map((image, idx) => (
                    <Image
                      key={idx}
                      src={image}
                      alt={`${step.title} - Image ${idx + 1}`}
                      width={130}
                      height={100}
                      className="rounded cursor-pointer"
                      onClick={() => setImagePreview(image)}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Image Preview Dialog */}
      <Dialog open={!!imagePreview} onOpenChange={() => setImagePreview("")}>
        <DialogContent className="max-w-4xl">
          <Zoom>
            <Image
              src={imagePreview}
              alt="Preview"
              width={800}
              height={600}
              className="rounded-lg"
            />
          </Zoom>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export const CreateProjectForm = ({ onCancel }: CreateProjectFormProps) => {
  const workspaceId = useWorkspaceId();
  const router = useRouter();
  const { mutate, isPending } = useCreateProject();
  const { mutate: mutateEP, isPending: isPendingEP } = useAddExistingProject();
  const inputRef = useRef<HTMLInputElement>(null);
  const form1 = useForm<CreateProjectSchema>({
    resolver: zodResolver(createProjectSchema.omit({ workspaceId: true })),
    defaultValues: {
      name: "",
      image: "",
      accessToken: "",
    },
  });

  const form2 = useForm<AddExistingProjectSchema>({
    resolver: zodResolver(addExistingProjectSchema.omit({ workspaceId: true })),
    defaultValues: {
      projectLink: "",
    },
  });
  const onSubmit = (values: CreateProjectSchema) => {
    const finalValues = {
      ...values,
      image: values.image instanceof File ? values.image : "",
      workspaceId,
    };
    mutate(
      { form: finalValues },
      {
        onSuccess: ({ data }) => {
          form1.reset();
          router.push(`/workspaces/${workspaceId}/projects/${data.$id}`);
        },
      }
    );
  };
  const onSubmitEP = (values: AddExistingProjectSchema) => {
    const finalValues = {
      ...values,
      workspaceId,
    };
    mutateEP(
      { form: finalValues },
      {
        onSuccess: ({ data }) => {
          form2.reset();
          router.push(`/workspaces/${workspaceId}/projects/${data.$id}`);
        },
      }
    );
  };
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      form1.setValue("image", file);
    }
  };

  return (
    <Tabs defaultValue="create-new-project p-4" className="w-full">
      <TabsList className="grid grid-cols-2">
        <TabsTrigger
          className={cn(
            "h-8 w-full lg:w-auto dark:text-gray-200",
            "data-[state=active]:bg-slate-800 data-[state=active]:text-primary-foreground",
            "data-[state=inactive]:bg-slate-200 data-[state=inactive]:dark:bg-gray-950 outline-none "
          )}
          value="create-new-project"
        >
          Create New Project
        </TabsTrigger>
        <TabsTrigger
          className={cn(
            "h-8 w-full lg:w-auto dark:text-gray-200",
            "data-[state=active]:bg-gray-800 data-[state=active]:text-primary-foreground",
            "data-[state=inactive]:bg-slate-200 data-[state=inactive]:dark:bg-gray-950 outline-none"
          )}
          value="add-existing-project"
        >
          Add Existing Project
        </TabsTrigger>
      </TabsList>
      <TabsContent value="create-new-project">
        <Card className="size-full border-none shadow-none sm:bg-slate-800">
          <CardHeader className="flex p-7">
            <CardTitle className="text-xl font-bold">
              Create new project
            </CardTitle>
          </CardHeader>
          <div className="px-7">
            <DottedSeparator />
          </div>
          <CardContent className="p-7">
            <Form {...form1}>
              <form onSubmit={form1.handleSubmit(onSubmit)}>
                <div className="flex flex-col gap-y-4">
                  <FormField
                    control={form1.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Project name</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Enter project name"
                            className="border border-slate-50"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="">
                    <FormField
                      control={form1.control}
                      name="accessToken"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex justify-between">
                            <div className="flex items-center">
                              Access Token{" "}
                              <Tooltip>
                                <TooltipTrigger>
                                  <span className="text-muted-foreground">
                                    <Info size={16} className="ml-2" />
                                  </span>
                                </TooltipTrigger>
                                <TooltipContent className="bg-slate-900 text-slate-100 max-w-sm flex place-content-center">
                                  <p className="text-sm">
                                    Access token is a unique identifier that
                                    allows you to access your repo data. You can
                                    generate an access token from your github
                                    account settings.
                                  </p>
                                </TooltipContent>
                              </Tooltip>
                            </div>
                            <p className="text-sm text-blue-400">
                              <Dialog>
                                <DialogTrigger asChild>
                                  <button className="underline">
                                    Steps to generate personal access token
                                  </button>
                                </DialogTrigger>
                                <DialogContent className="size-[400px] sm:size-[600px] overflow-y-auto">
                                  <DialogTitle>
                                    Steps to generate personal access token from
                                    Github
                                  </DialogTitle>
                                  <DialogDescription>
                                    <TokenSetupGuide />
                                  </DialogDescription>
                                </DialogContent>
                              </Dialog>
                            </p>
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="Enter access token"
                              className="border border-slate-50"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form1.control}
                    name="image"
                    render={({ field }) => (
                      <div className="flex flex-col gap-y-2">
                        <div className="flex items-center gap-x-5">
                          {field.value ? (
                            <div className="size-[72px] relative rounded-md overflow-hidden">
                              <Image
                                fill
                                src={
                                  field.value instanceof File
                                    ? URL.createObjectURL(field.value)
                                    : field.value
                                }
                                alt="Project Icon"
                                className="object-cover"
                              />
                            </div>
                          ) : (
                            <Avatar className="size-[72px]">
                              <AvatarFallback>
                                <ImageIcon className="size-[36px] text-neutral-400" />
                              </AvatarFallback>
                            </Avatar>
                          )}
                          <div className="flex flex-col">
                            <p className="text-sm">Project Icon</p>
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
                                className="w-fit mt-2"
                                disabled={isPending}
                                onClick={() => {
                                  field.onChange(null);
                                  if (inputRef.current)
                                    inputRef.current.value = "";
                                }}
                              >
                                Remove Icon
                              </Button>
                            ) : (
                              <Button
                                size="sm"
                                type="button"
                                variant="secondary"
                                className="w-fit mt-2"
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

                <DottedSeparator className="my-7" />

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
                    Create project
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="add-existing-project">
        <Card className="size-full border-none shadow-none sm:bg-slate-800">
          <CardHeader className="flex p-7">
            <CardTitle className="text-xl font-bold">
              Add existing project
            </CardTitle>
          </CardHeader>
          <div className="px-7">
            <DottedSeparator />
          </div>
          <CardContent className="p-7">
            <Form {...form2}>
              <form onSubmit={form2.handleSubmit(onSubmitEP)}>
                <div className="flex flex-col gap-y-4">
                  <FormField
                    control={form2.control}
                    name="projectLink"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Github link</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Paste your github link here"
                            className="border border-slate-50"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <DottedSeparator className="my-7" />

                <div className="flex items-center justify-between">
                  <Button
                    type="button"
                    size="lg"
                    variant="secondary"
                    onClick={onCancel}
                    disabled={isPendingEP}
                    className={cn(!onCancel && "invisible")}
                  >
                    Cancel
                  </Button>
                  <Button disabled={isPendingEP} type="submit" size="lg">
                    Create project
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

"use client";
import {
  UserPlus2,
  GitPullRequestCreateArrowIcon,
  EllipsisVertical,
  Settings,
  UploadIcon,
  Copy,
  CheckIcon,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { useState, useEffect, useMemo, useRef } from "react";
import ReactMarkdown from "react-markdown";

import { ProjectAvatar } from "@/features/projects/components/project-avatar";
import { TaskViewSwitcher } from "@/features/issues/components/task-view-switcher";
import { Button } from "@/components/ui/button";
import { useProjectId } from "@/features/projects/hooks/use-projectId";
import { useGetProject } from "@/features/projects/api/use-get-project";
import { Loader } from "@/components/page-loader";
import { PageError } from "@/components/page-error";
import { useGetProjectAnalytics } from "@/features/projects/api/use-get-project-analytics";
import { Analytics } from "@/components/analytics";
import { useAddCollaboratorToProjectModal } from "@/features/projects/hooks/use-add-collaborator-to-project-modal";
import { useCreatePrModal } from "@/features/projects/hooks/use-create-pr-modal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useFileUploadModal } from "@/features/projects/hooks/use-file-upload";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const ProjectIdClient = () => {
  const projectId = useProjectId();
  const { data: project, isLoading: projectsLoading } = useGetProject({
    projectId,
  });

  const { data: analytics, isLoading: analyticsLoading } =
    useGetProjectAnalytics({ projectId });

  const [readmeContent, setReadmeContent] = useState<string | null>(null);
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const { openPr } = useCreatePrModal();
  const { open: openCollaboratorModal } = useAddCollaboratorToProjectModal();
  const { openFileUploader } = useFileUploadModal();

  const isLoading = projectsLoading || analyticsLoading;

  const settingsUrl = useMemo(() => {
    if (!project) return "";
    return `/workspaces/${project.workspaceId}/projects/${project.$id}/settings`;
  }, [project]);

  const handleCreatePr = async () => {
    try {
      await openPr();
    } catch (error) {
      console.error("Error creating pull request:", error);
      toast.error(
        typeof error === "string"
          ? error
          : "You have to push to the specified branch first.",
      );
    }
  };

  const handleFileUpload = async () => {
    try {
      const result = await openFileUploader();
      if (result && result.get("success") === "true") {
        toast.success("README uploaded successfully");
      }
    } catch (error) {
      console.error("Error opening file uploader:", error);
      toast.error("Failed to open file uploader");
    }
  };

  const scrollPositionRef = useRef(0);

  // Process README content to handle any inconsistencies
  const processReadmeContent = (content: string | null) => {
    if (!content) return null;

    // Remove any duplicate heading markers that might cause rendering issues
    const processedContent = content
      .replace(/#{3,}/g, "### ") // Normalize headings with more than 3 #'s
      .replace(/\n#{1,2}\s*$/gm, "\n") // Remove empty h1 and h2 headings at end of lines
      .replace(/^#{1,2}\s*$/gm, "") // Remove standalone h1 and h2 headers
      .trim();

    return processedContent;
  };

  const handleCopyText = (text: string, event?: React.MouseEvent) => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
      // Store current scroll position
      scrollPositionRef.current = window.scrollY;
    }

    // Use the clipboard API with try/catch for better error handling
    try {
      navigator.clipboard.writeText(text);
      setCopiedText(text);

      // Use requestAnimationFrame for smoother scroll restoration
      requestAnimationFrame(() => {
        window.scrollTo({
          top: scrollPositionRef.current,
          behavior: "auto", // Use 'auto' instead of smooth to prevent visible scrolling
        });
      });

      setTimeout(() => {
        setCopiedText(null);
      }, 2000);
    } catch (error) {
      console.error("Failed to copy text:", error);
      toast.error("Failed to copy to clipboard");
    }
  };

  useEffect(() => {
    if (project && project.readme) {
      setReadmeContent(processReadmeContent(project.readme));
    } else {
      setReadmeContent(null);
    }
  }, [project]);

  if (isLoading) return <Loader />;
  if (!project) return <PageError message="Project not found" />;

  return (
    <div className="flex flex-col gap-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-x-2">
          <ProjectAvatar
            name={project.name}
            image={project.imageUrl}
            className="size-8"
          />
          <p className="text-lg font-semibold capitalize">{project.name}</p>
        </div>

        {/* Desktop actions */}
        <div className="hidden md:block">
          <div className="flex items-center space-x-4">
            <Button
              className="bg-slate-200 text-black hover:bg-slate-300"
              onClick={handleFileUpload}
              variant="default"
              size="sm"
            >
              <UploadIcon className="mr-1 size-4" />
              Upload Readme
            </Button>
            <Button
              className="bg-slate-200 text-black hover:bg-slate-300"
              onClick={handleCreatePr}
              variant="default"
              size="sm"
            >
              <GitPullRequestCreateArrowIcon className="mr-1 size-4" />
              Create Pull Request
            </Button>
            <Button variant="outline" size="sm" onClick={openCollaboratorModal}>
              <UserPlus2 className="mr-1 size-4" />
              Add Collaborator
            </Button>
            <Button
              className="bg-slate-200 text-black hover:bg-slate-300"
              variant="default"
              size="sm"
              asChild
            >
              <Link href={settingsUrl}>
                <Settings className="mr-1 size-4" />
                Settings
              </Link>
            </Button>
          </div>
        </div>

        {/* Mobile actions */}
        <div className="block md:hidden">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <EllipsisVertical className="size-4" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52 p-2">
              <div className="flex flex-col items-stretch space-y-2">
                <Button
                  className="w-full justify-start bg-slate-200 text-black hover:bg-slate-300"
                  onClick={handleFileUpload}
                  variant="default"
                >
                  <UploadIcon className="mr-2 size-4" />
                  Upload Readme
                </Button>
                <Button
                  className="w-full justify-start bg-slate-200 text-black hover:bg-slate-300"
                  onClick={handleCreatePr}
                  variant="default"
                >
                  <GitPullRequestCreateArrowIcon className="mr-2 size-4" />
                  Create Pull Request
                </Button>
                <Button
                  className="w-full justify-start"
                  variant="outline"
                  onClick={openCollaboratorModal}
                >
                  <UserPlus2 className="mr-2 size-4" />
                  Add Collaborator
                </Button>
                <Button
                  className="w-full justify-start bg-slate-200 text-black hover:bg-slate-300"
                  variant="default"
                  asChild
                >
                  <Link href={settingsUrl}>
                    <Settings className="mr-2 size-4" />
                    Settings
                  </Link>
                </Button>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {analytics && <Analytics data={analytics} />}

      <TaskViewSwitcher hideProjectFilter />

      {/* Readme Display */}
      {isLoading ? (
        <div className="mt-4">
          <Loader />
        </div>
      ) : readmeContent ? (
        <Card className="mt-4">
          <CardHeader className="flex flex-row items-center justify-between border-b">
            <CardTitle>README</CardTitle>
            {/* Update the README copy button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => handleCopyText(readmeContent, e)}
              className="h-8 px-2 text-muted-foreground"
            >
              {copiedText === readmeContent ? (
                <CheckIcon className="mr-2 size-4 text-green-500" />
              ) : (
                <Copy className="mr-2 size-4" />
              )}
              {copiedText === readmeContent ? "Copied" : "Copy"}
            </Button>
          </CardHeader>
          <CardContent className="prose prose-sm sm:prose-base dark:prose-invert max-w-none overflow-hidden p-6 font-sans">
            <div className="markdown-container text-base">
              <ReactMarkdown
                components={{
                  h1: ({ ...props }) => (
                    <h2
                      className="mb-4 font-sans text-xl font-bold"
                      {...props}
                    />
                  ),
                  h2: ({ ...props }) => (
                    <h3
                      className="mb-3 mt-6 font-sans text-lg font-bold"
                      {...props}
                    />
                  ),
                  h3: ({ ...props }) => (
                    <h4
                      className="mb-2 mt-5 font-sans text-base font-semibold"
                      {...props}
                    />
                  ),
                  p: ({ ...props }) => (
                    <p
                      className="my-3 font-sans text-base leading-relaxed"
                      {...props}
                    />
                  ),
                  ul: ({ ...props }) => (
                    <ul className="my-3 list-disc pl-6 font-sans" {...props} />
                  ),
                  ol: ({ ...props }) => (
                    <ol
                      className="my-3 list-decimal pl-6 font-sans"
                      {...props}
                    />
                  ),
                  li: ({ ...props }) => (
                    <li className="mb-1 font-sans" {...props} />
                  ),
                  blockquote: ({ ...props }) => (
                    <blockquote
                      className="my-3 border-l-4 border-gray-300 py-1 pl-4 font-sans italic dark:border-gray-700"
                      {...props}
                    />
                  ),
                  code: ({
                    inline,
                    className,
                    children,
                    ...props
                  }: React.ComponentPropsWithoutRef<"code"> & {
                    inline?: boolean;
                    className?: string;
                  }) => {
                    if (!children) return null;

                    const match = /language-(\w+)/.exec(className || "");
                    const codeText = String(children).replace(/\n$/, "");

                    return inline ? (
                      <code
                        className="max-w-7xl rounded bg-gray-100 px-1 py-0.5 font-mono text-sm dark:bg-gray-800"
                        {...props}
                      >
                        {children}
                      </code>
                    ) : (
                      <div className="relative my-3 max-w-4xl overflow-hidden rounded-md">
                        <div className="flex items-center justify-between bg-gray-200 px-3 py-1 text-xs font-semibold dark:bg-gray-700">
                          <span>
                            {match && match[1]
                              ? match[1].toUpperCase()
                              : "CODE"}
                          </span>
                          <button
                            type="button"
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCopyText(codeText, e);
                            }}
                            className="text-gray-500 hover:text-gray-700 focus:outline-none dark:text-gray-400 dark:hover:text-gray-300"
                            aria-label="Copy code"
                          >
                            {copiedText === codeText ? (
                              <CheckIcon className="size-3.5 text-green-500" />
                            ) : (
                              <Copy className="size-3.5" />
                            )}
                          </button>
                        </div>
                        <pre className="m-0 overflow-x-auto bg-gray-100 p-3 dark:bg-gray-800">
                          <code
                            className={`language-${match ? match[1] : ""} font-mono text-sm`}
                            {...props}
                          >
                            {children}
                          </code>
                        </pre>
                      </div>
                    );
                  },
                  pre: ({ children }) => <>{children}</>,
                  a: ({ href, ...props }) => (
                    <a
                      className="font-sans text-blue-600 hover:underline dark:text-blue-400"
                      href={href}
                      target={href?.startsWith("http") ? "_blank" : undefined}
                      rel={
                        href?.startsWith("http")
                          ? "noopener noreferrer"
                          : undefined
                      }
                      {...props}
                    />
                  ),
                  img: ({ src, alt, ...props }) => (
                    <img
                      src={src}
                      alt={alt || ""}
                      className="my-4 h-auto max-w-full rounded"
                      loading="lazy"
                      {...props}
                    />
                  ),
                  table: ({ ...props }) => (
                    <div className="my-3 overflow-x-auto">
                      <table
                        className="min-w-full divide-y divide-gray-200 font-sans dark:divide-gray-700"
                        {...props}
                      />
                    </div>
                  ),
                  thead: ({ ...props }) => (
                    <thead
                      className="bg-gray-50 font-sans dark:bg-gray-800"
                      {...props}
                    />
                  ),
                  th: ({ ...props }) => (
                    <th
                      className="px-4 py-3 text-left font-sans text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400"
                      {...props}
                    />
                  ),
                  td: ({ ...props }) => (
                    <td className="px-4 py-3 font-sans text-sm" {...props} />
                  ),
                }}
                remarkPlugins={[]}
              >
                {readmeContent || ""}
              </ReactMarkdown>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="mt-4 p-6 text-center">
          <p className="font-sans text-muted-foreground">
            No README file found. Upload one to display project information.
          </p>
          <Button
            onClick={handleFileUpload}
            variant="outline"
            size="sm"
            className="mt-3"
          >
            <UploadIcon className="mr-2 size-4" />
            Upload README
          </Button>
        </Card>
      )}
    </div>
  );
};

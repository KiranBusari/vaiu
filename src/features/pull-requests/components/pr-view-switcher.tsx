"use client";
import { useQueryState } from "nuqs";
import { Loader } from "lucide-react";

import { DottedSeparator } from "@/components/dotted-separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { useProjectId } from "@/features/projects/hooks/use-projectId";
import { useGetPullRequests } from "../api/use-get-pull-requests";
import { DataTable } from "./data-table";
import { columns } from "./columns";

export const PrViewSwitcher = () => {
  const [view, setView] = useQueryState("pr-view", {
    defaultValue: "table",
  });
  const workspaceId = useWorkspaceId();
  const projectId = useProjectId();

  const { data: prs, isLoading: prsLoading } = useGetPullRequests({
    workspaceId,
    projectId,
  });

  return (
    <Tabs
      defaultValue={view}
      onValueChange={setView}
      className="w-full flex-1 rounded-lg border"
    >
      <div className="flex h-full flex-col overflow-auto p-4">
        <div className="flex flex-col justify-between gap-y-2 lg:flex-row">
          <p className="flex items-center text-center text-xl font-bold">
            Pull Requests
          </p>
        </div>
        <div className="mt-4 flex w-full items-center justify-start gap-y-2 lg:flex-row">
          <TabsList className="w-full lg:w-auto">
            <TabsTrigger
              className="h-8 w-full bg-slate-200 dark:bg-gray-800 dark:text-gray-200 dark:data-[state=active]:bg-slate-200 dark:data-[state=active]:text-[#1e1e1e] lg:w-auto"
              value="table"
            >
              Table
            </TabsTrigger>
          </TabsList>
        </div>
        <DottedSeparator className="my-4" />
        {prsLoading ? (
          <div className="flex h-[200px] w-full flex-col items-center justify-center rounded-lg border">
            <Loader className="size-5 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <>
            <TabsContent value="table" className="mt-0">
              <DataTable columns={columns} data={(prs?.documents ?? [])} />
            </TabsContent>
          </>
        )}
      </div>
    </Tabs>
  );
};
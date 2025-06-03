import { ProjectAnalyticsResponseType } from "@/features/projects/api/use-get-project-analytics";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";
import { AnalyticsCard } from "./analytics-card";
import { DottedSeparator } from "./dotted-separator";

export const Analytics = ({ data }: ProjectAnalyticsResponseType) => {
  return (
    <ScrollArea className="w-full shrink-0 whitespace-nowrap rounded-lg border">
      <div className="flex w-full flex-row">
        <div className="flex flex-1 items-center">
          <AnalyticsCard
            title="Total Issues"
            value={data.taskCount}
            variant={data.taskDiff > 0 ? "up" : "down"}
            increasedValue={data.taskDiff}
          />
          <DottedSeparator direction="vertical" />
        </div>
        <div className="flex flex-1 items-center">
          <AnalyticsCard
            title="Assigned Issues"
            value={data.assignedTaskCount}
            variant={data.assignedTaskDiff > 0 ? "up" : "down"}
            increasedValue={data.assignedTaskDiff}
          />
          <DottedSeparator direction="vertical" />
        </div>
        <div className="flex flex-1 items-center">
          <AnalyticsCard
            title="Completed Issues"
            value={data.completedTaskCount}
            variant={data.completeTaskDiff > 0 ? "up" : "down"}
            increasedValue={data.completeTaskDiff}
          />
          <DottedSeparator direction="vertical" />
        </div>
        <div className="flex flex-1 items-center">
          <AnalyticsCard
            title="OverDue Issues"
            value={data.overdueTaskCount}
            variant={data.overdueTaskDiff > 0 ? "up" : "down"}
            increasedValue={data.overdueTaskDiff}
          />
          <DottedSeparator direction="vertical" />
        </div>
        <div className="flex flex-1 items-center">
          <AnalyticsCard
            title="Incomplete Issues"
            value={data.incompleteTaskCount}
            variant={data.incompleteTaskDiff > 0 ? "up" : "down"}
            increasedValue={data.incompleteTaskDiff}
          />
        </div>
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
};

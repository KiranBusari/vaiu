import { cn } from "@/lib/utils";
import { differenceInDays, format } from "date-fns";
import { CalendarIcon } from "lucide-react";

interface TaskDateProps {
  value: string;
  className?: string;
}

export const TaskDate = ({ value, className }: TaskDateProps) => {
  const today = new Date();
  const endDate = new Date(value);
  const diffInDays = differenceInDays(endDate, today);

  let textColor = "text-muted-foreground";
  let bgColor = "";

  if (diffInDays < 0) {
    textColor = "text-red-600 dark:text-red-400";
    bgColor = "bg-red-50 dark:bg-red-950/50";
  } else if (diffInDays < 3) {
    textColor = "text-red-600 dark:text-red-400";
    bgColor = "bg-red-50 dark:bg-red-950/50";
  } else if (diffInDays <= 7) {
    textColor = "text-orange-600 dark:text-orange-400";
    bgColor = "bg-orange-50 dark:bg-orange-950/50";
  } else if (diffInDays <= 14) {
    textColor = "text-yellow-600 dark:text-yellow-500";
    bgColor = "bg-yellow-50 dark:bg-yellow-950/50";
  }

  return (
    <div
      className={cn(
        "flex items-center gap-1 rounded-md px-1.5 py-0.5",
        bgColor,
        textColor,
        className,
      )}
    >
      <CalendarIcon className="size-3" />
      <span className="truncate text-xs font-medium">
        {format(new Date(value), "MMM dd")}
      </span>
    </div>
  );
};

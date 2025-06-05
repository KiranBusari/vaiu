import { FaCaretDown, FaCaretUp } from "react-icons/fa";
import { Card, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { cn } from "@/lib/utils";

interface AnalyticsCardProps {
  title: string;
  value: number;
  variant: "up" | "down";
  increasedValue: number;
}

export const AnalyticsCard = ({
  increasedValue,
  title,
  value,
  variant,
}: AnalyticsCardProps) => {
  const iconColor = variant === "up" ? "text-emerald-500" : "text-red-500";
  const increaseValueColor =
    variant === "up" ? "text-emerald-500" : "text-red-500";
  const Icon = variant === "up" ? FaCaretUp : FaCaretDown;

  return (
    <Card className="w-full min-w-0 border-none bg-slate-200 shadow-none dark:bg-gray-900">
      <CardHeader className="p-3 md:p-4">
        <div className="flex flex-col gap-1">
          <CardDescription className="flex items-center justify-between gap-x-1 overflow-hidden font-medium">
            <span className="truncate text-xs md:text-sm">{title}</span>
            <div className="flex flex-shrink-0 items-center gap-x-1">
              <Icon className={cn(iconColor, "size-3 md:size-4")} />
              <span
                className={cn(
                  "text-xs font-medium md:text-sm",
                  increaseValueColor,
                )}
              >
                {increasedValue}
              </span>
            </div>
          </CardDescription>
          <CardTitle className="truncate text-xl font-semibold md:text-2xl lg:text-3xl">
            {value}
          </CardTitle>
        </div>
      </CardHeader>
    </Card>
  );
};

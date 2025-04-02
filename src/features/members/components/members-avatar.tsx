import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface MemberAvatarProps {
  name: string;
  className?: string;
  fallbackClassName?: string;
}

export const MemberAvatar = ({
  name = "None",
  className,
  fallbackClassName,
}: MemberAvatarProps) => {
  return (
    <Avatar
      className={cn(
        "size-5 rounded-full border border-gray-300 transition dark:border-gray-700",
        className,
      )}
    >
      <AvatarFallback
        className={cn(
          "flex items-center justify-center bg-slate-200 font-medium text-gray-500 dark:bg-gray-800 dark:text-gray-300",
          fallbackClassName,
        )}
      >
        {name?.charAt(0)?.toUpperCase()}
      </AvatarFallback>
    </Avatar>
  );
};

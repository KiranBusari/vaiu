"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useGetRooms } from "@/features/channels/api/use-get-rooms";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { useProjectId } from "@/features/projects/hooks/use-projectId";
import { Separator } from "./ui/separator";
import { cn } from "@/lib/utils";

const Rooms = () => {
  const pathname = usePathname();
  const workspaceId = useWorkspaceId();
  const projectId = useProjectId();

  const { data } = useGetRooms({ workspaceId, projectId });

  const audioRooms = data?.documents.filter(
    (room) => room.roomType === "AUDIO",
  );

  const videoRooms = data?.documents.filter(
    (room) => room.roomType === "VIDEO",
  );

  return (
    <div className="flex flex-col gap-y-2">
      <ScrollArea className="flex-1">
        {!!audioRooms?.length && (
          <div className="mb-2">
            <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">
              Audio Rooms
            </p>
            <div className="space-y-[2px]">
              {audioRooms.map((room) => (
                <Link
                  key={room.$id}
                  href={`/workspaces/${workspaceId}/projects/${projectId}/rooms/${room.$id}`}
                >
                  <div
                    className={`cursor-pointer rounded-md p-2.5 transition hover:opacity-75 ${
                      pathname ===
                      `/workspaces/${workspaceId}/projects/${projectId}/rooms/${room.$id}`
                        ? "bg-white text-primary shadow-sm hover:opacity-100"
                        : "text-gray-500"
                    }`}
                  >
                    <span className="truncate">{room.name}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {!!videoRooms?.length && (
          <div className="mb-2">
            <p className="mb-2 text-sm font-semibold text-gray-500 dark:text-gray-400">
              Video Rooms
            </p>
            <div className="space-y-[2px]">
              {videoRooms.map((room) => (
                <Link
                  key={room.$id}
                  href={`/workspaces/${workspaceId}/projects/${projectId}/rooms/${room.$id}`}
                >
                  <div
                    className={cn(
                      "flex cursor-pointer items-center gap-2.5 rounded-md p-2.5 font-medium text-gray-500 transition hover:opacity-75 dark:text-gray-400",
                      pathname ===
                        `/workspaces/${workspaceId}/projects/${projectId}/rooms/${room.$id}`
                        ? "bg-white text-gray-100 text-primary shadow-sm hover:opacity-100 dark:bg-gray-800"
                        : "text-gray-500",
                    )}
                  >
                    <span className="truncate">{room.name}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
        <Separator className="my-4" />
      </ScrollArea>
    </div>
  );
};

export default Rooms;

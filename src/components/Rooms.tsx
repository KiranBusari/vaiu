"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useGetRooms } from "@/features/channels/api/use-get-rooms";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { useCreateRoomModal } from "@/features/channels/hooks/use-create-room-modal";
import { RiAddCircleFill } from "react-icons/ri";
import { useProjectId } from "@/features/projects/hooks/use-projectId";
import { DottedSeparator } from "./dotted-separator";
import { cn } from "@/lib/utils";

const Rooms = () => {
  const pathname = usePathname();
  const workspaceId = useWorkspaceId();
  const projectId = useProjectId();

  const { open } = useCreateRoomModal();
  const { data } = useGetRooms({ workspaceId });

  const audioRooms = data?.documents.filter(
    (room) => room.roomType === "AUDIO"
  );

  const videoRooms = data?.documents.filter(
    (room) => room.roomType === "VIDEO"
  );

  return (
    <div className="flex flex-col gap-y-2">
      <div className="flex items-center justify-between">
        <p className="text-xs uppercase text-gray-500 dark:text-gray-400">
          Rooms
        </p>
        <RiAddCircleFill
          onClick={open}
          className="size-5 text-gray-500 dark:text-gray-400 cursor-pointer hover:opacity-75 transition"
        />
      </div>
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
                    className={`p-2.5 rounded-md hover:opacity-75 transition cursor-pointer ${
                      pathname ===
                      `/workspaces/${workspaceId}/rooms/${room.$id}`
                        ? "bg-white shadow-sm hover:opacity-100 text-primary"
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
            <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2">
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
                      "flex items-center gap-2.5 p-2.5 rounded-md hover:opacity-75 transition cursor-pointer text-gray-500 dark:text-gray-400 font-medium",
                      pathname ===
                        `/workspaces/${workspaceId}/projects/${projectId}/rooms/${room.$id}`
                        ? "bg-white dark:bg-gray-800 text-gray-100 shadow-sm hover:opacity-100 text-primary"
                        : "text-gray-500"
                    )}
                  >
                    <span className="truncate">{room.name}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
        <DottedSeparator className="my-4" />
      </ScrollArea>
    </div>
  );
};

export default Rooms;

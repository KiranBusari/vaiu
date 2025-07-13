"use client";

import { useRouter } from "next/navigation";
import { PhoneCall, Video } from "lucide-react";
import { useGetRooms } from "@/features/channels/api/use-get-rooms";
import { useCreateRoomModal } from "@/features/channels/hooks/use-create-room-modal";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

interface RoomSwitcherProps {
  projectId: string;
  workspaceId: string;
}

export const RoomSwitcher = ({ projectId, workspaceId }: RoomSwitcherProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const { open } = useCreateRoomModal();
  const { data: rooms, isLoading } = useGetRooms({ workspaceId, projectId });

  const currentRoomId = pathname.includes("/rooms/")
    ? pathname.split("/rooms/")[1].split("?")[0]
    : undefined;

  const audioRooms = rooms?.documents.filter(
    (room) => room.roomType === "AUDIO",
  );
  const videoRooms = rooms?.documents.filter(
    (room) => room.roomType === "VIDEO",
  );

  const handleJoinRoom = (roomId: string, type: string) => {
    router.push(
      `/workspaces/${workspaceId}/projects/${projectId}/rooms/${roomId}?type=${type.toLowerCase()}`,
    );
  };

  return (
    <div className="flex flex-col gap-y-2">
      {isLoading ? (
        <div className="flex justify-center p-2 text-sm text-muted-foreground">
          Loading...
        </div>
      ) : (
        <ScrollArea className="h-[200px] pr-2">
          {videoRooms && videoRooms.length > 0 && (
            <div className="mb-2 space-y-1">
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                Video Rooms
              </p>
              {videoRooms.map((room) => (
                <Button
                  key={room.$id}
                  variant="ghost"
                  className={cn(
                    "h-8 w-full justify-start px-2 text-sm",
                    currentRoomId === room.$id &&
                      "bg-slate-100 dark:bg-slate-800",
                  )}
                  onClick={() => handleJoinRoom(room.$id, "VIDEO")}
                >
                  <Video className="mr-2 h-3.5 w-3.5" />
                  <span className="truncate">{room.name}</span>
                </Button>
              ))}
            </div>
          )}

          {audioRooms && audioRooms.length > 0 && (
            <div className="space-y-1">
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                Audio Rooms
              </p>
              {audioRooms.map((room) => (
                <Button
                  key={room.$id}
                  variant="ghost"
                  className={cn(
                    "h-8 w-full justify-start px-2 text-sm",
                    currentRoomId === room.$id &&
                      "bg-slate-100 dark:bg-slate-800",
                  )}
                  onClick={() => handleJoinRoom(room.$id, "AUDIO")}
                >
                  <PhoneCall className="mr-2 h-3.5 w-3.5" />
                  <span className="truncate">{room.name}</span>
                </Button>
              ))}
            </div>
          )}

          {(!audioRooms || audioRooms.length === 0) &&
            (!videoRooms || videoRooms.length === 0) && (
              <div className="py-4 text-center">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  No rooms available
                </p>
                <Button
                  onClick={open}
                  variant="outline"
                  size="sm"
                  className="mt-2"
                >
                  Create a room
                </Button>
              </div>
            )}
        </ScrollArea>
      )}
    </div>
  );
};

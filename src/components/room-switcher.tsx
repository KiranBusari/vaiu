"use client";

import { useRouter } from "next/navigation";
import { RiAddCircleFill } from "react-icons/ri";
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

    const currentRoomId = pathname.includes('/rooms/')
        ? pathname.split('/rooms/')[1].split('?')[0]
        : undefined;

    const audioRooms = rooms?.documents.filter(room => room.roomType === "AUDIO");
    const videoRooms = rooms?.documents.filter(room => room.roomType === "VIDEO");

    const handleJoinRoom = (roomId: string, type: string) => {
        router.push(`/workspaces/${workspaceId}/projects/${projectId}/rooms/${roomId}?type=${type.toLowerCase()}`);
    };

    return (
        <div className="flex flex-col gap-y-2">
            <div className="flex items-center justify-between">
                <p className="text-xs uppercase text-gray-500 dark:text-gray-400 font-semibold">
                    Rooms
                </p>
                <RiAddCircleFill
                    onClick={open}
                    className="size-5 text-gray-500 dark:text-gray-400 cursor-pointer hover:opacity-75 transition"
                />
            </div>

            {isLoading ? (
                <div className="flex justify-center p-2 text-sm text-muted-foreground">Loading...</div>
            ) : (
                <ScrollArea className="h-[200px] pr-2">
                    {videoRooms && videoRooms.length > 0 && (
                        <div className="space-y-1 mb-2">
                            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                                Video Rooms
                            </p>
                            {videoRooms.map(room => (
                                <Button
                                    key={room.$id}
                                    variant="ghost"
                                    className={cn(
                                        "w-full justify-start text-sm h-8 px-2",
                                        currentRoomId === room.$id && "bg-slate-100 dark:bg-slate-800"
                                    )}
                                    onClick={() => handleJoinRoom(room.$id, "VIDEO")}
                                >
                                    <Video className="h-3.5 w-3.5 mr-2" />
                                    <span className="truncate">{room.name}</span>
                                </Button>
                            ))}
                        </div>
                    )}

                    {audioRooms && audioRooms.length > 0 && (
                        <div className="space-y-1">
                            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                                Audio Rooms
                            </p>
                            {audioRooms.map(room => (
                                <Button
                                    key={room.$id}
                                    variant="ghost"
                                    className={cn(
                                        "w-full justify-start text-sm h-8 px-2",
                                        currentRoomId === room.$id && "bg-slate-100 dark:bg-slate-800"
                                    )}
                                    onClick={() => handleJoinRoom(room.$id, "AUDIO")}
                                >
                                    <PhoneCall className="h-3.5 w-3.5 mr-2" />
                                    <span className="truncate">{room.name}</span>
                                </Button>
                            ))}
                        </div>
                    )}

                    {(!audioRooms || audioRooms.length === 0) &&
                        (!videoRooms || videoRooms.length === 0) && (
                            <div className="text-center py-4">
                                <p className="text-sm text-gray-500 dark:text-gray-400">No rooms available</p>
                                <Button onClick={open} variant="outline" size="sm" className="mt-2">
                                    Create a room
                                </Button>
                            </div>
                        )}
                </ScrollArea>
            )}
        </div>
    );
};
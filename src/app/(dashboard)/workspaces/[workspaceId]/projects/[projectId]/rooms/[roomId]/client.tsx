"use client"

import { ChatHeader } from "@/components/chat/chat-header";
import { ChatInput } from "@/components/chat/chat-input";
import { ChatMessages } from "@/components/chat/chat-messages";
import { MediaRoom } from "@/components/media-room";
import { useCurrent } from "@/features/auth/api/use-curent";
import { getCurrent } from "@/features/auth/queries";
import { useGetRoom } from "@/features/channels/api/use-get-room";
import { useRoomId } from "@/features/channels/hooks/use-roomId";
import { useProjectId } from "@/features/projects/hooks/use-projectId";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { redirect } from "next/navigation";

export const RoomId = async () => {

    const workspaceId = useWorkspaceId()
    const projectId = useProjectId()
    const roomId = useRoomId()
    const { data: current } = useCurrent()

    if (!current) {
        return redirect("/sign-in");
    }

    const { data: room } = useGetRoom({ roomId });

    if (!room) return
        // return redirect(`/workspaces/${workspaceId}/projects/${projectId}`);

    return (
        <div className="bg-white dark:bg-[#14171A] flex flex-col h-full">
            {/* <ChatHeader
        name={room.name}
        serverId={room.roomId}
        type="room"
      />

      {room.type === roomType.TEXT && (
        <>
          <ChatMessages
            name={room.name}
            member={member}
            chatId={room.id}
            apiUrl="/api/messages"
            socketUrl="/api/socket/messages"
            socketQuery={{
              roomId: room.id,
              serverId: room.serverId,
            }}
            paramKey="roomId"
            paramValue={room.id}
            type="room"
          />
          <ChatInput
            apiUrl="/api/socket/messages"
            query={{
              roomId: room.id,
              serverId: room.serverId,
            }}
            name={room.name}
            type="room"
          />
        </>
      )} */}

            {room.roomType === "AUDIO" && (
                <MediaRoom audio={true} video={false} chatId={room.id} />
            )}

            {room.roomType === "VIDEO" && (
                <MediaRoom audio={true} video={true} chatId={room.id} />
            )}

        </div>
    );
};
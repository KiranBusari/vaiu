import { getCurrent } from "@/features/auth/queries";
import { NextApiRequest } from "next";
import { DATABASE_ID, MESSAGE_ID, ROOMS_ID } from "@/config";
import { ID } from "node-appwrite";
import { Room } from "@/features/channels/types";
import { getMember } from "@/features/members/utilts";
import { NextApiResponseServerIo } from "@/pages/api/socket/types";
import { createSessionClient } from "@/lib/appwrite";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponseServerIo
) {
  if (req.method !== "POST")
    return res.status(405).json({ message: "Method not allowed" });

  try {
    const user = await getCurrent();

    const { content, roomId } = req.body;
    console.log(content, roomId);
    console.log(user);  
    
    if (!user) return res.status(401).json({ message: "Unauthorized" });

    if (!roomId) return res.status(400).json({ message: "Room id is required" });

    if (!content) return res.status(400).json({ message: "Content is required" });

    const {databases} = await createSessionClient()

    const room = await databases.getDocument<Room>(
      DATABASE_ID,
      ROOMS_ID,
      roomId
    )

    if (!room) return res.status(404).json({ message: "Room not found" });

    const member = await getMember({
      databases,
      workspaceId: room.workspaceId,
      userId: user.$id
    })

    if (!member) return res.status(401).json({ message: "Unauthorized" });

    const message = await databases.createDocument(
      DATABASE_ID,
      MESSAGE_ID,
      ID.unique(),
      {
        content,
        userId: user.$id,
        roomId
      }
    )

    const roomKey = `chat:${roomId}:messages`;

    res?.socket?.server?.io.emit(roomKey, message);

    return res.status(200).json({
      message
    });
  } catch (error) {
    console.log("[MESSAGES_POST_ERROR]", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
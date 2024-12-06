import { getCurrent } from "@/features/auth/queries";
import { NextApiRequest } from "next";
import { DATABASE_ID, MESSAGE_ID, ROOMS_ID } from "@/config";
import { Client, Databases, ID } from "node-appwrite";
import { Room } from "@/features/channels/types";
import { getMember } from "@/features/members/utilts";
import { NextApiResponseServerIo } from "@/pages/api/socket/types";
import { createSessionClient } from "@/lib/appwrite";
import { useCurrent } from "@/features/auth/api/use-curent";
import { sessionMiddleware } from "@/lib/session-middleware";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponseServerIo
) {
  if (req.method !== "POST")
    return res.status(405).json({ message: "Method not allowed" });

  try {
    // const { data: user } = useCurrent()
    // console.log("User", user);

    // const user = await getCurrent()
    // console.log("User", user);

    const user = req.query.memberId
    console.log("MemberId", user);

    const { content } = req.body;

    const roomId = req.query.roomId;

    if (!user) return res.status(401).json({ message: "Unauthorized" });

    if (!roomId) return res.status(400).json({ message: "Room id is required" });

    if (!content) return res.status(400).json({ message: "Content is required" });

    // const { databases } = await createSessionClient();
    // console.log("databases", databases);

    const { databases } = await createSessionClient();

    const room = await databases.getDocument<Room>(
      DATABASE_ID,
      ROOMS_ID,
      roomId[0]
    )

    if (!room) return res.status(404).json({ message: "Room not found" });

    const member = await getMember({
      databases,
      workspaceId: room.workspaceId,
      userId: user[0]
    })

    console.log("Member", member);


    if (!member) return res.status(401).json({ message: "Unauthorized" });

    const message = await databases.createDocument(
      DATABASE_ID,
      MESSAGE_ID,
      ID.unique(),
      {
        content,
        userId: user,
        roomId
      }
    )

    const roomKey = `chat:${roomId}:messages`;

    res?.socket?.server?.io.emit(roomKey, message);

    return res.status(200).json({
      message
    });
  } catch (error) {
    console.log("Error", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
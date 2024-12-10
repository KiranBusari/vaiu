// import { getCurrent } from "@/features/auth/queries";
// import { NextApiRequest } from "next";
// import { DATABASE_ID, MESSAGE_ID, ROOMS_ID } from "@/config";
// import { Client, Databases, ID } from "node-appwrite";
// import { Room } from "@/features/channels/types";
// import { getMember } from "@/features/members/utilts";
// import { NextApiResponseServerIo } from "@/pages/api/socket/types";
// import { useCurrent } from "@/features/auth/api/use-curent";
// import { cookies } from "next/headers";
// import { AUTH_COOKIE } from "@/features/auth/constants";
// import cookie from "cookie";

// export default async function handler(
//   req: NextApiRequest,
//   res: NextApiResponseServerIo
// ) {
//   if (req.method !== "POST")
//     return res.status(405).json({ message: "Method not allowed" });

//   try {
//     // const { data: user } = useCurrent()
//     // console.log("User", user);

//     // const user = await getCurrent()
//     // console.log("User", user);

//     const user = req.query.memberId as string

//     const { content } = req.body;

//     const roomId = req.query.roomId as string;

//     if (!user) return res.status(401).json({ message: "Unauthorized" });

//     if (!roomId) return res.status(400).json({ message: "Room id is required" });

//     if (!content) return res.status(400).json({ message: "Content is required" });

//     const client = new Client()

//     client.setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
//     client.setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT!)

//     const databases = new Databases(client)

//     console.log("databases", databases);

//     const room = await databases.getDocument<Room>(
//       DATABASE_ID,
//       ROOMS_ID,
//       roomId
//     )

//     console.log("Room", room);

//     if (!room) return res.status(404).json({ message: "Room not found" });

//     const member = await getMember({
//       databases,
//       workspaceId: room.workspaceId,
//       userId: user
//     })

//     if (!member) return res.status(401).json({ message: "Unauthorized" });

//     const message = await databases.createDocument(
//       DATABASE_ID,
//       MESSAGE_ID,
//       ID.unique(),
//       {
//         content,
//         userId: user,
//         roomId
//       }
//     )

//     console.log("Message", message);


//     const roomKey = `chat:${roomId}:messages`;

//     res?.socket?.server?.io.emit(roomKey, message);

//     return res.status(200).json({
//       message
//     });
//   } catch (error) {
//     console.log("Error", error);
//     return res.status(500).json({ message: "Internal server error" });
//   }
// }


import { DATABASE_ID, MESSAGE_ID, ROOMS_ID } from "@/config";
import { sessionMiddleware } from "@/lib/session-middleware";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { ID } from "node-appwrite";
import { createMessageSchema } from "@/features/messages/types";
import { Room } from "@/features/channels/types";
import { getMember } from "@/features/members/utilts";
import { Server as SocketIOServer } from "socket.io";

const app = new Hono<{ Bindings: { io: SocketIOServer } }>();

app
  .post(
    "/",
    sessionMiddleware,
    zValidator("form", createMessageSchema),
    async (c) => {
      const databases = c.get("databases");
      const user = c.get("user");

      const { content, roomId } = c.req.valid("form");

      if (!user) return c.json({
        message: "Unauthorized"
      }, 401);

      if (!roomId) return c.json({
        message: "Room id is required"
      }, 400);

      if (!content) return c.json({
        message: "Content is required"
      }, 400);

      const room = await databases.getDocument<Room>(
        DATABASE_ID,
        ROOMS_ID,
        roomId
      )

      if (!room) return c.json({
        message: "Room not found"
      }, 404);

      const member = await getMember({
        databases,
        workspaceId: room.workspaceId,
        userId: user.$id
      })

      if (!member) return c.json({
        message: "Unauthorized"
      }, 401);

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

      c.env.io.emit(roomKey, message);

      return c.json({
        message
      }, 201);
    }
  )

export default app
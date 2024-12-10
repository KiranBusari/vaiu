import { DATABASE_ID, MESSAGE_ID, ROOMS_ID } from "@/config";
import { sessionMiddleware } from "@/lib/session-middleware";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { ID } from "node-appwrite";
import { createMessageSchema } from "../types";
import { Room } from "@/features/channels/types";
import { getMember } from "@/features/members/utilts";
import { NextApiResponseServerIo } from "@/pages/api/socket/types";
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
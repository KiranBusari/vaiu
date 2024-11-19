import { ID, Query } from "node-appwrite";
import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";

import { sessionMiddleware } from "@/lib/session-middleware";
import {
  DATABASE_ID,
  ROOMS_ID,
} from "@/config";
import { RoomSchema } from "../schemas";
import { z } from "zod";
import { getMember } from "@/features/members/utilts";

const app = new Hono()
  .post(
    "/",
    zValidator("json", RoomSchema),
    sessionMiddleware,
    async (c) => {
      const databases = c.get("databases");
      const user = c.get("user");


      const { name, roomType, workspaceId } = c.req.valid("json");
      console.log(name, roomType, workspaceId);

      const member = await getMember({
        databases,
        workspaceId,
        userId: user.$id,
      });

      if (!member) return c.json({ error: "Unauthorized" }, 401);

      try {
        const room = await databases.createDocument(
          DATABASE_ID,
          ROOMS_ID,
          ID.unique(),
          {
            name,
            roomType,
            workspaceId
          }
        );

        return c.json({ data: room });
      } catch (error) {
        console.error("Error creating room:", error);
        return c.json({ error: "Failed to create room" }, 500);
      }
    }
  )
  .get("/", sessionMiddleware, zValidator("query", z.object({ workspaceId: z.string() })), async (c) => {
    const databases = c.get("databases");

    const { workspaceId } = c.req.valid("query");

    if (!workspaceId) {
      return c.json({ error: "Missing workspaceId" }, 400);
    }

    const rooms = await databases.listDocuments(
      DATABASE_ID,
      ROOMS_ID,
      [Query.equal("workspaceId", workspaceId), Query.orderDesc("$createdAt")]
    )

    console.log("rooms", rooms);

    return c.json({ data: rooms });
  })
export default app;

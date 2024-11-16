import { ID, Query } from "node-appwrite";
import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";

import { sessionMiddleware } from "@/lib/session-middleware";
import {
  DATABASE_ID,
  MEMBERS_ID,
  ROOMS_ID,
} from "@/config";
import { RoomSchema } from "../schemas";
import { z } from "zod";

const app = new Hono()
  .post(
    "/",
    zValidator("form", RoomSchema),
    sessionMiddleware,
    async (c) => {
      const databases = c.get("databases");

      const { name, type, workspaceId } = c.req.valid("form");

      const room = await databases.createDocument(
        DATABASE_ID,
        ROOMS_ID,
        ID.unique(),
        {
          name,
          type,
          workspaceId
        }
      );

      return c.json({ data: room });
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

    return c.json({ data: rooms });
  })
export default app;

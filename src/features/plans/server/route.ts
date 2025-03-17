import { ID } from "node-appwrite";
import { Hono } from "hono";

import { sessionMiddleware } from "@/lib/session-middleware";
import { DATABASE_ID, PLANS_ID } from "@/config";

const app = new Hono().post("/:planName", sessionMiddleware, async (c) => {
  const user = c.get("user");
  const databases = c.get("databases");

  // Razorpay payment gateway integration

  const planName = c.req.param("planName");

  const createPlan = await databases.createDocument(
    DATABASE_ID,
    PLANS_ID,
    ID.unique(),
    {
      name: planName,
      price: 100,
      maxWorkspaces: 1,
      maxProjects: 1,
      maxRooms: 1,
      userId: user.$id,
    }
  );

  return c.json({ data: createPlan });
});

export default app;

import { z } from "zod";
import { NotificationEntityType } from "./types";

export const createNotificationSchema = z.object({
  userId: z.string(),
  workspaceId: z.string(),
  projectId: z.string(),
  entityId: z.string(),
  type: z.nativeEnum(NotificationEntityType),
  title: z.string(),
  body: z.string(),
});

export type CreateNotificationSchema = z.infer<typeof createNotificationSchema>;
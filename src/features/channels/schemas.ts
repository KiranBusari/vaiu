import { z } from "zod";
import { RoomType } from "./types";

export const RoomSchema = z.object({
  name: z
    .string()
    .min(1, "Channel Name is required")
    .max(32, "Channel Name is too long"),
  roomType: z.nativeEnum(RoomType),
  workspaceId: z.string(),
  projectId: z.string(),
});

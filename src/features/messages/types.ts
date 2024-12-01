import { z } from "zod";

export const createMessageSchema = z.object({
  content: z.string().min(1),
  roomId: z.string(),
  userId: z.string(),
});
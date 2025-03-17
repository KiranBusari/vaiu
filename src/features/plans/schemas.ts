import { z } from "zod";

export const createPlanSchema = z.object({
  userId: z.string(),
  planName: z.string().trim().min(1, { message: "Required" }),
  price: z.number().optional(),
  maxWorkspaces: z.number().optional(),
  maxProjects: z.number().optional(),
  maxRooms: z.number().optional(),
});

export type CreatePlanSchema = z.infer<typeof createPlanSchema>;

import { z } from "zod";

export const plans = z.enum(["Free", "Pro", "Enterprise"]);

export const subscriptionSchema = z.object({
  userId: z.string(),
  plan: plans,
  startDate: z.date(),
  endDate: z.date(),
  status: z.enum(["active", "inactive", "cancelled"]),
  workspaceLimit: z.number(),
  projectLimit: z.number(),
  roomLimit: z.number(),
});

export type Subscription = z.infer<typeof subscriptionSchema>;

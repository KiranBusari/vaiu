import { z } from "zod";
import { IssueStatus } from "./types";

export const createTaskSchema = z.object({
  name: z.string().trim().min(1, { message: "Required" }),
  status: z.nativeEnum(IssueStatus, { required_error: "Required" }),
  workspaceId: z.string().trim().min(1, { message: "Required" }),
  projectId: z.string().trim().min(1, { message: "Required" }),
  assigneeId: z.string().trim().min(1, { message: "Required" }),
  dueDate: z.coerce.date(),
  description: z.string().optional(),
});

export type CreateTaskSchema = z.infer<typeof createTaskSchema>;

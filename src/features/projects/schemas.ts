import { z } from "zod";

export const createProjectSchema = z.object({
  name: z.string().trim().min(1, { message: "Required" }),
  image: z
    .union([
      z.instanceof(File),
      z.string().transform((value) => (value === "" ? undefined : value)),
    ])
    .optional(),

  workspaceId: z.string(),
  accessToken: z.string().optional(),
});
export const updateProjectSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, { message: "Minimum 1 character required" })
    .optional(),
  image: z
    .union([
      z.instanceof(File),
      z.string().transform((value) => (value === "" ? undefined : value)),
    ])
    .optional(),
});

export const addCollaboratorToProjectSchema = z.object({
  projectId: z.string(),
  assigneeId: z.string(),
});

export const removeCollaboratorFromProjectSchema = z.object({
  projectId: z.string(),
  memberId: z.string(),
});

export const createPrSchema = z.object({
  title: z.string().trim().min(1, { message: "Required" }),
  description: z.string().trim().min(1, { message: "Required" }),
  branch: z.string().trim().min(1, { message: "Required" }),
});

export type CreateProjectSchema = z.infer<typeof createProjectSchema>;
export type UpdateProjectSchema = z.infer<typeof updateProjectSchema>;
export type AddCollaboratorToProjectSchema = z.infer<
  typeof addCollaboratorToProjectSchema
>;
export type RemoveCollaboratorFromProjectSchema = z.infer<
  typeof removeCollaboratorFromProjectSchema
>;
export type CreatePrSchema = z.infer<typeof createPrSchema>;

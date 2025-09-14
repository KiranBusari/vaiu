import { Models } from "node-appwrite";

export enum MemberRole {
  ADMIN = "ADMIN",
  MEMBER = "MEMBER",
  SUPER_ADMIN = "SUPER_ADMIN",
}

export type Member = Models.Document & {
  workspaceId: string;
  projectId: string[];
  userId: string;
  role: MemberRole;
};

import { Models } from "node-appwrite";

export type Issue = Models.Document & {
  name: string;
  status: IssueStatus;
  assigneeId: string;
  workspaceId: string;
  projectId: string;
  position: number;
  dueDate: string;
  description?: string;
};

export enum IssueStatus {
  BACKLOG = "BACKLOG",
  TODO = "TODO",
  IN_PROGRESS = "IN_PROGRESS",
  IN_REVIEW = "IN_REVIEW",
  DONE = "DONE",
}

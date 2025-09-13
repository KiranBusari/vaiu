import { Models } from "node-appwrite";

export type Notification = Models.Document & {
  userId: string;
  workspaceId: string;
  projectId: string;
  entityId: string;
  type: NotificationEntityType;
  title: string;
  body: string;
  isRead: boolean;
};

export enum NotificationEntityType {
    PULL_REQUEST = "PULL_REQUEST",
    ISSUE = "ISSUE",
    COMMIT = "COMMIT",
}
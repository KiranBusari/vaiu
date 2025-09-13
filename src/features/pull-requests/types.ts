import { Models } from "node-appwrite";

export type PullRequest = Models.Document & {
  title: string;
  status: PrStatus;
  author: string;
  assignee?: string;
  url: string;
  number: number;
};

export enum PrStatus {
  OPEN = "OPEN",
  CLOSED = "CLOSED",
  MERGED = "MERGED",
}

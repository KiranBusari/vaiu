import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import * as crypto from "crypto";
import { Project } from "@/features/projects/types";
import { DATABASE_ID, PROJECTS_ID, NOTIFICATIONS_ID, MEMBERS_ID } from "@/config";
import { Query, ID } from "node-appwrite";
import { NotificationEntityType, Notification } from "../types";
import { sessionMiddleware } from "@/lib/session-middleware";
import { Member } from "@/features/members/types";

const app = new Hono()
  .get("/", sessionMiddleware, async (c) => {
    const databases = c.get("databases");
    const user = c.get("user");

    const notifications = await databases.listDocuments<Notification>(
      DATABASE_ID,
      NOTIFICATIONS_ID,
      [Query.equal("userId", user.$id), Query.orderDesc("$createdAt")]
    );

    return c.json({ data: notifications });
  })
  .post("/webhook",sessionMiddleware, async (c) => {
    const secret = process.env.GITHUB_WEBHOOK_SECRET || "";
    const signature = c.req.header("X-Hub-Signature-256");
    const payload = await c.req.text();

    const databases = c.get("databases");

    if (!signature) {
      throw new HTTPException(400, { message: "Missing signature" });
    }

    const expectedSignature = `sha256=${crypto
      .createHmac("sha256", secret)
      .update(payload)
      .digest("hex")}`;

    if (signature !== expectedSignature) {
      throw new HTTPException(401, { message: "Invalid signature" });
    }

    const event = c.req.header("X-GitHub-Event");
    const data = JSON.parse(payload);

    const repositoryName = data.repository.name;

    const projects = await databases.listDocuments<Project>(
      DATABASE_ID,
      PROJECTS_ID,
      [Query.equal("name", repositoryName)]
    );

    if (projects.total === 0) {
      console.error(`Project with name "${repositoryName}" not found.`);
      return c.json({ success: false, error: "Project not found" });
    }
    const project = projects.documents[0];

    const members = await databases.listDocuments<Member>(
      DATABASE_ID,
      MEMBERS_ID,
      [Query.equal("projectId", project.$id)]
    );

    let notificationPayload;

    switch (event) {
      case "pull_request":
        notificationPayload = {
          title: `Pull Request #${data.pull_request.number} ${data.action}`,
          body: data.pull_request.title,
          workspaceId: project.workspaceId,
          projectId: project.$id,
          entityId: String(data.pull_request.id),
          type: NotificationEntityType.PULL_REQUEST,
          isRead: false,
        };
        break;
      case "issues":
        notificationPayload = {
          title: `Issue #${data.issue.number} ${data.action}`,
          body: data.issue.title,
          workspaceId: project.workspaceId,
          projectId: project.$id,
          entityId: String(data.issue.id),
          type: NotificationEntityType.ISSUE,
          isRead: false,
        };
        break;
      case "issue_comment":
        if (data.issue.pull_request) {
          notificationPayload = {
            title: `New comment on Pull Request #${data.issue.number}`,
            body: data.comment.body,
            workspaceId: project.workspaceId,
            projectId: project.$id,
            entityId: String(data.issue.id),
            type: NotificationEntityType.PULL_REQUEST,
            isRead: false,
          };
        } else {
          notificationPayload = {
            title: `New comment on Issue #${data.issue.number}`,
            body: data.comment.body,
            workspaceId: project.workspaceId,
            projectId: project.$id,
            entityId: String(data.issue.id),
            type: NotificationEntityType.ISSUE,
            isRead: false,
          };
        }
        break;
      case "pull_request_review":
        notificationPayload = {
          title: `Review ${data.review.state} on Pull Request #${data.pull_request.number}`,
          body: data.review.body || "",
          workspaceId: project.workspaceId,
          projectId: project.$id,
          entityId: String(data.pull_request.id),
          type: NotificationEntityType.PULL_REQUEST,
          isRead: false,
        };
        break;
      case "pull_request_review_comment":
        notificationPayload = {
          title: `New comment on Pull Request #${data.pull_request.number}`,
          body: data.comment.body,
          workspaceId: project.workspaceId,
          projectId: project.$id,
          entityId: String(data.pull_request.id),
          type: NotificationEntityType.PULL_REQUEST,
          isRead: false,
        };
        break;
      case "push":
        notificationPayload = {
          title: `New commit by ${data.pusher.name}`,
          body: data.head_commit.message,
          workspaceId: project.workspaceId,
          projectId: project.$id,
          entityId: String(data.head_commit.id),
          type: NotificationEntityType.COMMIT,
          isRead: false,
        };
        break;
      default:
        console.log(`Unhandled event: ${event}`);
    }

    if (notificationPayload) {
      for (const member of members.documents) {
        try {
          await databases.createDocument(
            DATABASE_ID,
            NOTIFICATIONS_ID,
            ID.unique(),
            { ...notificationPayload, userId: member.userId }
          );
        } catch (error) {
          console.error(`Failed to create notification for user ${member.userId}:`, error);
        }
      }
    }

    return c.json({ success: true });
  })
  .post("/:id/mark-as-read", sessionMiddleware, async (c) => {
    const databases = c.get("databases");
    const user = c.get("user");
    const notificationId = c.req.param("id");

    const notification = await databases.getDocument<Notification>(
      DATABASE_ID,
      NOTIFICATIONS_ID,
      notificationId
    );

    if (notification.userId !== user.$id) {
      throw new HTTPException(403, { message: "Forbidden" });
    }

    const updatedNotification = await databases.updateDocument<Notification>(
      DATABASE_ID,
      NOTIFICATIONS_ID,
      notificationId,
      { isRead: true }
    );

    return c.json({ data: updatedNotification });
  });

export default app;

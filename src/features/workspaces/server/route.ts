import { ID, Query } from "node-appwrite";
import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";

import { sessionMiddleware } from "@/lib/session-middleware";
import {
  DATABASE_ID,
  IMAGES_BUCKET_ID,
  MEMBERS_ID,
  ISSUES_ID,
  WORKSPACE_ID,
  PROJECTS_ID,
} from "@/config";

import {
  createWorkspaceSchema,
  inviteCodeSchema,
  updateWorkspaceSchema,
} from "../schemas";
import { MemberRole } from "@/features/members/types";
import { generateInviteCode, INVITECODE_LENGTH } from "@/lib/utils";
import { getMember, getProjectMember } from "@/features/members/utilts";
import { Workspace } from "../types";
import { endOfMonth, startOfMonth, subMonths } from "date-fns";
import { IssueStatus } from "@/features/issues/types";
import { Project } from "@/features/projects/types";

const app = new Hono()
  .get("/", sessionMiddleware, async (c) => {
    const user = c.get("user");
    const databases = c.get("databases");
    const members = await databases.listDocuments(DATABASE_ID, MEMBERS_ID, [
      Query.equal("userId", user.$id),
    ]);

    if (members.total == 0) {
      return c.json({ data: { documents: [] }, total: 0 });
    }
    const workspaceIds = members.documents.map((member) => member.workspaceId);
    const workspaces = await databases.listDocuments(
      DATABASE_ID,
      WORKSPACE_ID,
      [Query.orderDesc("$createdAt"), Query.contains("$id", workspaceIds)],
    );
    return c.json({ data: workspaces });
  })
  .get("/:workspaceId", sessionMiddleware, async (c) => {
    const user = c.get("user");
    const databases = c.get("databases");
    const { workspaceId } = c.req.param();

    const member = await getMember({
      databases,
      workspaceId,
      userId: user.$id,
    });

    if (!member) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const workspace = await databases.getDocument<Workspace>(
      DATABASE_ID,
      WORKSPACE_ID,
      workspaceId,
    );

    return c.json({ data: workspace });
  })
  .get("/:workspaceId/info", sessionMiddleware, async (c) => {
    const databases = c.get("databases");
    const { workspaceId } = c.req.param();

    const workspace = await databases.getDocument<Workspace>(
      DATABASE_ID,
      WORKSPACE_ID,
      workspaceId,
    );

    return c.json({
      data: {
        $id: workspace.$id,
        name: workspace.name,
        imageUrl: workspace.imageUrl,
        inviteCode: workspace.inviteCode,
      },
    });
  })
  .post(
    "/",
    zValidator("form", createWorkspaceSchema),
    sessionMiddleware,
    async (c) => {
      try {
        const databases = c.get("databases");
        const storage = c.get("storage");
        const user = c.get("user");

        const { name, image } = c.req.valid("form");

        let uploadedImage: string | undefined;
        if (image instanceof File) {
          const file = await storage.createFile(
            IMAGES_BUCKET_ID,
            ID.unique(),
            image,
          );
          const buffer: ArrayBuffer = await storage.getFilePreview(
            IMAGES_BUCKET_ID,
            file.$id,
          );
          uploadedImage = `data:image/png;base64,${Buffer.from(buffer).toString(
            "base64",
          )}`;
        }

        const existingWorkspace = await databases.listDocuments(
          DATABASE_ID,
          WORKSPACE_ID,
          [
            Query.equal("name", name),
            Query.equal("userId", user.$id),
            Query.limit(1),
          ],
        );

        if (existingWorkspace.total !== 0) {
          return c.json({ error: "Workspace already exists" }, 400);
        } else {
          const workspace = await databases.createDocument(
            DATABASE_ID,
            WORKSPACE_ID,
            ID.unique(),
            {
              name,
              userId: user.$id,
              imageUrl: uploadedImage,
              inviteCode: generateInviteCode(INVITECODE_LENGTH),
            },
          );

          await databases.createDocument(DATABASE_ID, MEMBERS_ID, ID.unique(), {
            userId: user.$id,
            workspaceId: workspace.$id,
            role: MemberRole.ADMIN,
          });
          return c.json({ data: workspace });
        }
      } catch (error) {
        console.log(error);
      }
    },
  )
  .patch(
    "/:workspaceId",
    sessionMiddleware,
    zValidator("form", updateWorkspaceSchema),
    async (c) => {
      const databases = c.get("databases");
      const storage = c.get("storage");
      const user = c.get("user");

      const { workspaceId } = c.req.param();
      const { name, image } = c.req.valid("form");
      const member = await getMember({
        databases,
        workspaceId,
        userId: user.$id,
      });

      if (!member || member.role !== MemberRole.ADMIN) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      let uploadedImage: string | undefined;
      if (image instanceof File) {
        const file = await storage.createFile(
          IMAGES_BUCKET_ID,
          ID.unique(),
          image,
        );
        const buffer: ArrayBuffer = await storage.getFilePreview(
          IMAGES_BUCKET_ID,
          file.$id,
        );
        uploadedImage = `data:image/png;base64,${Buffer.from(buffer).toString(
          "base64",
        )}`;
      } else {
        uploadedImage = image;
      }
      const updatedWorkspace = await databases.updateDocument(
        DATABASE_ID,
        WORKSPACE_ID,
        workspaceId,
        {
          name,
          imageUrl: uploadedImage,
        },
      );

      return c.json({ data: updatedWorkspace });
    },
  )
  .delete("/:workspaceId", sessionMiddleware, async (c) => {
    const databases = c.get("databases");
    const user = c.get("user");
    const { workspaceId } = c.req.param();
    const member = await getMember({
      databases,
      workspaceId,
      userId: user.$id,
    });
    if (!member || member.role !== MemberRole.ADMIN) {
      return c.json({ error: "Unauthorized" }, 401);
    }
    // TODO: delete members, projects, tasks
    await databases.deleteDocument(DATABASE_ID, WORKSPACE_ID, workspaceId);
    return c.json({ data: { $id: workspaceId } });
  })
  .post("/:workspaceId/reset-invite-code", sessionMiddleware, async (c) => {
    const databases = c.get("databases");
    const user = c.get("user");
    const { workspaceId } = c.req.param();
    const member = await getMember({
      databases,
      workspaceId,
      userId: user.$id,
    });
    if (!member || member.role !== MemberRole.ADMIN) {
      return c.json({ error: "Unauthorized" }, 401);
    }
    const workspace = await databases.updateDocument(
      DATABASE_ID,
      WORKSPACE_ID,
      workspaceId,
      {
        inviteCode: generateInviteCode(INVITECODE_LENGTH),
      },
    );
    return c.json({ data: workspace });
  })
  .post(
    "/:workspaceId/join",
    sessionMiddleware,
    zValidator("json", inviteCodeSchema),
    async (c) => {
      const { workspaceId } = c.req.param();
      const { code } = c.req.valid("json");

      const databases = c.get("databases");
      const user = c.get("user");

      const member = await getMember({
        databases,
        workspaceId,
        userId: user.$id,
      });
      if (member) {
        return c.json({ error: "Already a membber" }, 400);
      }

      const workspace = await databases.getDocument<Workspace>(
        DATABASE_ID,
        WORKSPACE_ID,
        workspaceId,
      );

      if (workspace.inviteCode !== code) {
        return c.json({ error: "Invalid invite code" }, 400);
      }

      await databases.createDocument(DATABASE_ID, MEMBERS_ID, ID.unique(), {
        workspaceId,
        userId: user.$id,
        role: MemberRole.MEMBER,
      });
      return c.json({ data: workspace });
    },
  )
  .get("/:workspaceId/analytics", sessionMiddleware, async (c) => {
    const databases = c.get("databases");
    const user = c.get("user");
    const { workspaceId } = c.req.param();

    const member = await getMember({
      databases,
      workspaceId: workspaceId,
      userId: user.$id,
    });
    if (!member) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const now = new Date();
    const thisMonthStart = startOfMonth(now);
    const thisMonthEnd = endOfMonth(now);
    const lastMonthStart = startOfMonth(subMonths(now, 1));
    const lastMonthEnd = endOfMonth(subMonths(now, 1));

    const thisMonthTasks = await databases.listDocuments(
      DATABASE_ID,
      ISSUES_ID,
      [
        Query.equal("workspaceId", workspaceId),
        Query.greaterThanEqual("$createdAt", thisMonthStart.toISOString()),
        Query.lessThanEqual("$createdAt", thisMonthEnd.toISOString()),
      ],
    );
    const lastMonthTasks = await databases.listDocuments(
      DATABASE_ID,
      ISSUES_ID,
      [
        Query.equal("workspaceId", workspaceId),
        Query.greaterThanEqual("$createdAt", lastMonthStart.toISOString()),
        Query.lessThanEqual("$createdAt", lastMonthEnd.toISOString()),
      ],
    );

    const taskCount = thisMonthTasks.total;
    const taskDiff = taskCount - lastMonthTasks.total;

    const thisMonthAssignedTasks = await databases.listDocuments(
      DATABASE_ID,
      ISSUES_ID,
      [
        Query.equal("workspaceId", workspaceId),
        Query.equal("assigneeId", member.$id),
        Query.greaterThanEqual("$createdAt", thisMonthStart.toISOString()),
        Query.lessThanEqual("$createdAt", thisMonthEnd.toISOString()),
      ],
    );
    const lastMonthAssignedTasks = await databases.listDocuments(
      DATABASE_ID,
      ISSUES_ID,
      [
        Query.equal("workspaceId", workspaceId),
        Query.equal("assigneeId", member.$id),
        Query.greaterThanEqual("$createdAt", lastMonthStart.toISOString()),
        Query.lessThanEqual("$createdAt", lastMonthEnd.toISOString()),
      ],
    );

    const assignedTaskCount = thisMonthAssignedTasks.total;
    const assignedTaskDiff = assignedTaskCount - lastMonthAssignedTasks.total;

    const thisMonthIncompleteTasks = await databases.listDocuments(
      DATABASE_ID,
      ISSUES_ID,
      [
        Query.equal("workspaceId", workspaceId),
        Query.notEqual("status", IssueStatus.DONE),
        Query.greaterThanEqual("$createdAt", thisMonthStart.toISOString()),
        Query.lessThanEqual("$createdAt", thisMonthEnd.toISOString()),
      ],
    );
    const lastMonthIncompleteTasks = await databases.listDocuments(
      DATABASE_ID,
      ISSUES_ID,
      [
        Query.equal("workspaceId", workspaceId),
        Query.notEqual("status", IssueStatus.DONE),
        Query.greaterThanEqual("$createdAt", lastMonthStart.toISOString()),
        Query.lessThanEqual("$createdAt", lastMonthEnd.toISOString()),
      ],
    );

    const incompleteTaskCount = thisMonthIncompleteTasks.total;
    const incompleteTaskDiff =
      incompleteTaskCount - lastMonthIncompleteTasks.total;

    const thisMonthCompletedTasks = await databases.listDocuments(
      DATABASE_ID,
      ISSUES_ID,
      [
        Query.equal("workspaceId", workspaceId),
        Query.equal("status", IssueStatus.DONE),
        Query.greaterThanEqual("$createdAt", thisMonthStart.toISOString()),
        Query.lessThanEqual("$createdAt", thisMonthEnd.toISOString()),
      ],
    );
    const lastMonthCompletedTasks = await databases.listDocuments(
      DATABASE_ID,
      ISSUES_ID,
      [
        Query.equal("workspaceId", workspaceId),
        Query.equal("status", IssueStatus.DONE),
        Query.greaterThanEqual("$createdAt", lastMonthStart.toISOString()),
        Query.lessThanEqual("$createdAt", lastMonthEnd.toISOString()),
      ],
    );

    const completedTaskCount = thisMonthCompletedTasks.total;
    const completeTaskDiff = completedTaskCount - lastMonthCompletedTasks.total;

    const thisMonthOverDueTasks = await databases.listDocuments(
      DATABASE_ID,
      ISSUES_ID,
      [
        Query.equal("workspaceId", workspaceId),
        Query.notEqual("status", IssueStatus.DONE),
        Query.lessThan("dueDate", now.toISOString()),
        Query.greaterThanEqual("$createdAt", thisMonthStart.toISOString()),
        Query.lessThanEqual("$createdAt", thisMonthEnd.toISOString()),
      ],
    );
    const lastMonthOverDueTasks = await databases.listDocuments(
      DATABASE_ID,
      ISSUES_ID,
      [
        Query.equal("workspaceId", workspaceId),
        Query.notEqual("status", IssueStatus.DONE),
        Query.lessThan("dueDate", now.toISOString()),
        Query.greaterThanEqual("$createdAt", lastMonthStart.toISOString()),
        Query.lessThanEqual("$createdAt", lastMonthEnd.toISOString()),
      ],
    );

    const overdueTaskCount = thisMonthOverDueTasks.total;
    const overdueTaskDiff = overdueTaskCount - lastMonthOverDueTasks.total;

    return c.json({
      data: {
        taskCount,
        taskDiff,
        assignedTaskCount,
        assignedTaskDiff,
        incompleteTaskCount,
        incompleteTaskDiff,
        completedTaskCount,
        completeTaskDiff,
        overdueTaskCount,
        overdueTaskDiff,
      },
    });
  })
  .get("/:workspaceId/isworkspacemember", sessionMiddleware, async (c) => {
    const user = c.get("user");
    const databases = c.get("databases");
    const { workspaceId } = c.req.param();

    const member = await getMember({
      databases,
      workspaceId,
      userId: user.$id,
    });

    return c.json({
      data: {
        isMember: !!member,
        member: member,
      },
    });
  })
  .post(
    "/:workspaceId/projects/:projectId/join",
    sessionMiddleware,
    zValidator("json", inviteCodeSchema),
    async (c) => {
      const { workspaceId } = c.req.param();
      const { projectId } = c.req.param();
      const { code } = c.req.valid("json");

      const databases = c.get("databases");
      const user = c.get("user");

      const member = await getProjectMember({
        databases,
        workspaceId,
        projectId,
        userId: user.$id,
      });

      if (member) {
        return c.json({ error: "Already a member of this project" }, 400);
      }

    const project = await databases.getDocument<Project>(
        DATABASE_ID,
        PROJECTS_ID,
        projectId,
      );

      if (project.inviteCode !== code) {
        return c.json({ error: "Invalid invite code" }, 400);
      }

      await databases.createDocument(DATABASE_ID, MEMBERS_ID, ID.unique(), {
        workspaceId,
        projectId,
        userId: user.$id,
        role: MemberRole.MEMBER,
      });
      return c.json({ data: project });
    },
  )

export default app;

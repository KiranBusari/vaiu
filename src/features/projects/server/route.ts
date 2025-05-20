import { z } from "zod";
import { Hono } from "hono";
import { ID, Query } from "node-appwrite";
import { zValidator } from "@hono/zod-validator";
import { sessionMiddleware } from "@/lib/session-middleware";

import { getMember } from "@/features/members/utilts";
import {
  DATABASE_ID,
  IMAGES_BUCKET_ID,
  PR_ID,
  PROJECTS_ID,
  ISSUES_ID,
} from "@/config";

import {
  addCollaboratorToProjectSchema,
  createProjectSchema,
  updateProjectSchema,
  createPrSchema,
  addExistingProjectSchema,
  fileUploadSchema,
} from "../schemas";
import { Project } from "../types";
import { endOfMonth, startOfMonth, subMonths } from "date-fns";
import { IssueStatus } from "@/features/issues/types";
import { Octokit } from "octokit";

const extractRepoName = (githubUrl: string): string => {
  // Split by '/' and get the last segment
  const segments = githubUrl.split("/");
  // Get the last segment and remove .git
  const repoName = segments[segments.length - 1].replace(".git", "");
  return repoName;
};

const app = new Hono()
  .post(
    "/",
    sessionMiddleware,
    zValidator("form", createProjectSchema),
    async (c) => {
      const databases = c.get("databases");
      const storage = c.get("storage");
      const user = c.get("user");

      const { name, image, workspaceId, accessToken } = c.req.valid("form");
      const octokit = new Octokit({
        auth: accessToken,
      });

      const member = await getMember({
        databases,
        workspaceId,
        userId: user.$id,
      });

      if (!member) {
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
      }

      const existingProject = await databases.listDocuments<Project>(
        DATABASE_ID,
        PROJECTS_ID,
        [
          Query.equal("workspaceId", workspaceId),
          Query.orderDesc("$createdAt"),
          Query.equal("name", name),
          Query.limit(1),
        ],
      );

      const correctedName = name.replace(/\s+/g, "-").toLowerCase();

      if (existingProject.total !== 0) {
        return c.json({ error: "Project with this name already exists" }, 400);
      } else {
        const repo = await octokit.rest.repos.createForAuthenticatedUser({
          name: name,
        });

        if (!repo.data) {
          return c.json({ error: "Failed to create repository" }, 500);
        }

        const project = await databases.createDocument(
          DATABASE_ID,
          PROJECTS_ID,
          ID.unique(),
          {
            name: correctedName,
            imageUrl: uploadedImage,
            accessToken,
            workspaceId,
            projectAdmin: member.$id,
          },
        );

        return c.json({ data: project, repo: repo.data });
      }
    },
  )
  .post(
    "/add-existing-project",
    sessionMiddleware,
    zValidator("form", addExistingProjectSchema),
    async (c) => {
      const databases = c.get("databases");
      const user = c.get("user");

      const { projectLink, workspaceId, accessToken } = c.req.valid("form");
      // console.log("projectLink", projectLink);
      // console.log("workspaceId", workspaceId);
      // console.log("accessToken", accessToken);

      if (!projectLink) {
        return c.json({ error: "Please Paste the project link" }, 401);
      }
      const repoName = extractRepoName(projectLink);
      // console.log("repoName", repoName);

      const member = await getMember({
        databases,
        workspaceId,
        userId: user.$id,
      });

      if (!member) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const project = await databases.createDocument(
        DATABASE_ID,
        PROJECTS_ID,
        ID.unique(),
        {
          name: repoName,
          workspaceId,
          projectAdmin: member.$id,
          accessToken,
        },
      );

      const octokit = new Octokit({
        auth: accessToken,
      });

      const owner = await octokit.rest.users.getAuthenticated();

      const { data } = await octokit.rest.issues.listForRepo({
        owner: owner.data.login,
        repo: repoName,
      });

      console.log("issues", data);

      const status = IssueStatus.TODO;

      const highestPositionTask = await databases.listDocuments(
        DATABASE_ID,
        ISSUES_ID,
        [
          Query.equal("status", status),
          Query.equal("workspaceId", workspaceId),
          Query.orderAsc("position"),
          Query.limit(1),
        ],
      );

      const newPosition =
        highestPositionTask.documents.length > 0
          ? highestPositionTask.documents[0].position + 1000
          : 1000;

      data.map(async (issue) => {
        await databases.createDocument(DATABASE_ID, ISSUES_ID, ID.unique(), {
          name: issue.title,
          description: issue.body,
          workspaceId,
          projectId: project.$id,
          assigneeId: issue?.assignee?.login,
          status,
          position: newPosition,
          dueDate: issue.created_at,
        });
      });
      return c.json({ data: project, issues: data });
    },
  )
  .get(
    "/",
    sessionMiddleware,
    zValidator("query", z.object({ workspaceId: z.string() })),
    async (c) => {
      const user = c.get("user");
      const databases = c.get("databases");

      const { workspaceId } = c.req.valid("query");
      if (!workspaceId) {
        return c.json({ error: "Missing workspaceId" }, 400);
      }

      const member = await getMember({
        databases,
        workspaceId,
        userId: user.$id,
      });

      if (!member) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const projects = await databases.listDocuments<Project>(
        DATABASE_ID,
        PROJECTS_ID,
        [
          Query.equal("workspaceId", workspaceId),
          Query.orderDesc("$createdAt"),
        ],
      );

      return c.json({ data: projects });
    },
  )
  .get("/:projectId", sessionMiddleware, async (c) => {
    const databases = c.get("databases");
    const user = c.get("user");
    const { projectId } = c.req.param();

    const project = await databases.getDocument<Project>(
      DATABASE_ID,
      PROJECTS_ID,
      projectId,
    );

    const member = await getMember({
      databases,
      workspaceId: project.workspaceId,
      userId: user.$id,
    });

    if (!member) {
      return c.json({ error: "Unauthorized" }, 401);
    }
    return c.json({ data: project });
  })
  .get("/:projectId/analytics", sessionMiddleware, async (c) => {
    const databases = c.get("databases");
    const user = c.get("user");
    const { projectId } = c.req.param();

    const project = await databases.getDocument<Project>(
      DATABASE_ID,
      PROJECTS_ID,
      projectId,
    );

    const member = await getMember({
      databases,
      workspaceId: project.workspaceId,
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
        Query.equal("projectId", projectId),
        Query.greaterThanEqual("$createdAt", thisMonthStart.toISOString()),
        Query.lessThanEqual("$createdAt", thisMonthEnd.toISOString()),
      ],
    );
    const lastMonthTasks = await databases.listDocuments(
      DATABASE_ID,
      ISSUES_ID,
      [
        Query.equal("projectId", projectId),
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
        Query.equal("projectId", projectId),
        Query.equal("assigneeId", member.$id),
        Query.greaterThanEqual("$createdAt", thisMonthStart.toISOString()),
        Query.lessThanEqual("$createdAt", thisMonthEnd.toISOString()),
      ],
    );
    const lastMonthAssignedTasks = await databases.listDocuments(
      DATABASE_ID,
      ISSUES_ID,
      [
        Query.equal("projectId", projectId),
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
        Query.equal("projectId", projectId),
        Query.notEqual("status", IssueStatus.DONE),
        Query.greaterThanEqual("$createdAt", thisMonthStart.toISOString()),
        Query.lessThanEqual("$createdAt", thisMonthEnd.toISOString()),
      ],
    );
    const lastMonthIncompleteTasks = await databases.listDocuments(
      DATABASE_ID,
      ISSUES_ID,
      [
        Query.equal("projectId", projectId),
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
        Query.equal("projectId", projectId),
        Query.equal("status", IssueStatus.DONE),
        Query.greaterThanEqual("$createdAt", thisMonthStart.toISOString()),
        Query.lessThanEqual("$createdAt", thisMonthEnd.toISOString()),
      ],
    );
    const lastMonthCompletedTasks = await databases.listDocuments(
      DATABASE_ID,
      ISSUES_ID,
      [
        Query.equal("projectId", projectId),
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
        Query.equal("projectId", projectId),
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
        Query.equal("projectId", projectId),
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
  .patch(
    "/:projectId",
    sessionMiddleware,
    zValidator("form", updateProjectSchema),
    async (c) => {
      const databases = c.get("databases");
      const storage = c.get("storage");
      const user = c.get("user");

      const { projectId } = c.req.param();
      const { name, image } = c.req.valid("form");

      const existingProject = await databases.getDocument<Project>(
        DATABASE_ID,
        PROJECTS_ID,
        projectId,
      );
      const member = await getMember({
        databases,
        workspaceId: existingProject.workspaceId,
        userId: user.$id,
      });

      if (!member) {
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
      const updatedProject = await databases.updateDocument(
        DATABASE_ID,
        PROJECTS_ID,
        projectId,
        {
          name,
          imageUrl: uploadedImage,
        },
      );

      return c.json({ data: updatedProject });
    },
  )
  .delete("/:projectId", sessionMiddleware, async (c) => {
    const databases = c.get("databases");
    const user = c.get("user");
    const { projectId } = c.req.param();

    const existingProject = await databases.getDocument<Project>(
      DATABASE_ID,
      PROJECTS_ID,
      projectId,
    );

    const member = await getMember({
      databases,
      workspaceId: existingProject.workspaceId,
      userId: user.$id,
    });

    if (!member || existingProject.projectAdmin !== member.$id) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const octokit = new Octokit({
      auth: existingProject.accessToken,
    });

    const owner = await octokit.rest.users.getAuthenticated();
    // TODO: delete  tasks
    await octokit.rest.repos.delete({
      owner: owner.data.login,
      repo: existingProject.name,
    });
    await databases.deleteDocument(DATABASE_ID, PROJECTS_ID, projectId);
    return c.json({ data: { $id: existingProject.$id } });
  })
  .post(
    "/:projectId/addCollaborator",
    sessionMiddleware,
    zValidator("json", addCollaboratorToProjectSchema),
    async (c) => {
      const databases = c.get("databases");
      const user = c.get("user");
      const { projectId } = c.req.param();

      const { username } = c.req.valid("json");

      const existingProject = await databases.getDocument<Project>(
        DATABASE_ID,
        PROJECTS_ID,
        projectId,
      );

      const octokit = new Octokit({
        auth: existingProject.accessToken,
      });

      const member = await getMember({
        databases,
        workspaceId: existingProject.workspaceId,
        userId: user.$id,
      });

      if (!member || existingProject.projectAdmin !== member.$id) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      if (existingProject.projectCollaborators.includes(username)) {
        return c.json({ error: "Collaborator already exists" }, 400);
      }

      const owner = await octokit.rest.users.getAuthenticated();

      try {
        await octokit.rest.repos.addCollaborator({
          owner: owner.data.login,
          repo: existingProject.name,
          username: username,
          permission: "push",
        });

        const projectCollaborators = Array.isArray(
          existingProject.projectCollaborators,
        )
          ? existingProject.projectCollaborators
          : [];

        const updatedCollaborators = [...projectCollaborators, username];

        await databases.updateDocument(DATABASE_ID, PROJECTS_ID, projectId, {
          projectCollaborators: updatedCollaborators,
        });

        return c.json({ data: { updatedCollaborators } });
      } catch (error) {
        console.error("Failed to add collaborator:", error);
        return c.json({ error: "Failed to add collaborator" }, 500);
      }
    },
  )
  .post(
    "/:projectId/submit-pull-request",
    sessionMiddleware,
    zValidator("form", createPrSchema),
    async (c) => {
      const databases = c.get("databases");
      const user = c.get("user");

      const { projectId } = c.req.param();

      const { title, description, branch } = c.req.valid("form");

      if (!title || !description || !branch) {
        return c.json({ error: "Description and branch are required" }, 400);
      }

      const existingProject = await databases.getDocument<Project>(
        DATABASE_ID,
        PROJECTS_ID,
        projectId,
      );

      const project = await databases.getDocument<Project>(
        DATABASE_ID,
        PROJECTS_ID,
        projectId,
      );

      if (!existingProject) {
        return c.json({ error: "Project not found" }, 404);
      }
      if (!project) {
        return c.json({ error: "Project not found" }, 404);
      }

      const member = await getMember({
        databases,
        workspaceId: project.workspaceId,
        userId: user.$id,
      });

      if (!member) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const octokit = new Octokit({
        auth: project.accessToken,
      });

      const owner = await octokit.rest.users.getAuthenticated();

      try {
        const createPR = await octokit.rest.pulls.create({
          owner: owner.data.login,
          repo: project.name,
          title: title,
          body: description,
          head: branch,
          base: "main",
        });

        await databases.createDocument(DATABASE_ID, PR_ID, ID.unique(), {
          title,
          description,
          branch,
          projectId,
        });

        return c.json(
          {
            success: true,
            data: {
              pullRequest: createPR.data,
            },
          },
          200,
        );
      } catch (error) {
        console.error("Failed to create PR:", error);
        return c.json({ error: "Failed to create PR" }, 500);
      }
    },
  )
  .post(
    "/upload-file",
    sessionMiddleware,
    zValidator("form", fileUploadSchema),
    async (c) => {
      const storage = c.get("storage");
      const { file } = c.req.valid("form");
      console.log("File", file);
      if (!file) {
        return c.json({ error: "File is required" }, 400);
      }

      let uploadedFile;
      if (file instanceof File) {
        uploadedFile = await storage.createFile(
          IMAGES_BUCKET_ID,
          ID.unique(),
          file,
        );
      } else {
        return c.json({ error: "Invalid file type" }, 400);
      }

      return c.json({ data: uploadedFile });
    },
  );

export default app;

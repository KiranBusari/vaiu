import { z } from "zod";
import { Hono } from "hono";
import { ID, Query } from "node-appwrite";
import { zValidator } from "@hono/zod-validator";
import { sessionMiddleware } from "@/lib/session-middleware";

import { getMember } from "@/features/members/utilts";
import {
  DATABASE_ID,
  IMAGES_BUCKET_ID,
  PROJECTS_ID,
  ISSUES_ID,
  MEMBERS_ID,
} from "@/config";

import {
  addCollaboratorToProjectSchema,
  createProjectSchema,
  updateProjectSchema,
  addExistingProjectSchema,
  fileUploadSchema,
} from "../schemas";
import { Project } from "../types";
import { endOfMonth, startOfMonth } from "date-fns";
import { IssueStatus } from "@/features/issues/types";
import { Octokit } from "octokit";
import { generateInviteCode, INVITECODE_LENGTH } from "@/lib/utils";
import { MemberRole } from "@/features/members/types";

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
      console.log("User", user);

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
            inviteCode: generateInviteCode(INVITECODE_LENGTH),
            owner: repo.data.owner.login,
          },
        );

        // Update member's projectId array
        const currentProjectIds = member.projectId || [];
        await databases.updateDocument(DATABASE_ID, MEMBERS_ID, member.$id, {
          projectId: [...currentProjectIds, project.$id],
          role: MemberRole.ADMIN,
        });

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
      
      const octokit = new Octokit({
        auth: accessToken,
      });
      
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

      const owner = await octokit.rest.users.getAuthenticated();

      const project = await databases.createDocument(
        DATABASE_ID,
        PROJECTS_ID,
        ID.unique(),
        {
          name: repoName,
          workspaceId,
          projectAdmin: member.$id,
          accessToken,
          inviteCode: generateInviteCode(INVITECODE_LENGTH),
          owner: owner.data.login,
        },
      );

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

      // Update member's projectId array
      const currentProjectIds = member.projectId || [];
      await databases.updateDocument(DATABASE_ID, MEMBERS_ID, member.$id, {
        projectId: [...currentProjectIds, project.$id],
        role: MemberRole.ADMIN,
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
  .get(
    "/get-projects",
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

      const memberDocuments = await databases.listDocuments(
        DATABASE_ID,
        MEMBERS_ID,
        [
          Query.equal("workspaceId", workspaceId),
          Query.equal("userId", user.$id),
        ],
      );

      if (memberDocuments.documents.length === 0) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const projectIds = memberDocuments.documents.flatMap(
        (member) => member.projectId || [],
      );

      if (projectIds.length === 0) {
        return c.json({ data: { documents: [], total: 0 } });
      }

      try {
        // Since Query.contains doesn't work with $id, we'll fetch all projects for the workspace
        // and then filter them manually
        const projects = await databases.listDocuments<Project>(
          DATABASE_ID,
          PROJECTS_ID,
          [
            Query.equal("workspaceId", workspaceId),
            Query.orderDesc("$createdAt"),
          ],
        );

        // Filter the projects to only include those in the projectIds array
        const validProjects = projects.documents.filter(
          (project) => project !== null && projectIds.includes(project.$id),
        );

        return c.json({
          data: {
            documents: validProjects,
            total: validProjects.length,
          },
        });
      } catch (error) {
        console.error("Error fetching projects:", error);
        return c.json({ error: "Failed to fetch projects" }, 500);
      }
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

    const thisMonthTasks = await databases.listDocuments(
      DATABASE_ID,
      ISSUES_ID,
      [
        Query.equal("projectId", projectId),
        Query.greaterThanEqual("$createdAt", thisMonthStart.toISOString()),
        Query.lessThanEqual("$createdAt", thisMonthEnd.toISOString()),
      ],
    );

    const totalTasks = await databases.listDocuments(DATABASE_ID, ISSUES_ID, [
      Query.equal("projectId", projectId),
    ]);

    const totalTaskCount = totalTasks.total;
    const taskDiff = thisMonthTasks.total;

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
    const totalAssignedTasks = await databases.listDocuments(
      DATABASE_ID,
      ISSUES_ID,
      [
        Query.equal("projectId", projectId),
        Query.equal("assigneeId", member.$id),
      ],
    );

    const assignedTaskCount = totalAssignedTasks.total;
    const assignedTaskDiff = thisMonthAssignedTasks.total;

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
    const totalIncompleteTasks = await databases.listDocuments(
      DATABASE_ID,
      ISSUES_ID,
      [
        Query.equal("projectId", projectId),
        Query.notEqual("status", IssueStatus.DONE),
      ],
    );

    const incompleteTaskCount = totalIncompleteTasks.total;
    const incompleteTaskDiff = thisMonthIncompleteTasks.total;

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
    const totalCompletedTasks = await databases.listDocuments(
      DATABASE_ID,
      ISSUES_ID,
      [
        Query.equal("projectId", projectId),
        Query.equal("status", IssueStatus.DONE),
      ],
    );

    const completedTaskCount = totalCompletedTasks.total;
    const completeTaskDiff = thisMonthCompletedTasks.total;

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
    const totalOverDueTasks = await databases.listDocuments(
      DATABASE_ID,
      ISSUES_ID,
      [
        Query.equal("projectId", projectId),
        Query.notEqual("status", IssueStatus.DONE),
        Query.lessThan("dueDate", now.toISOString()),
      ],
    );

    const overdueTaskCount = totalOverDueTasks.total;
    const overdueTaskDiff = thisMonthOverDueTasks.total;

    return c.json({
      data: {
        totalTaskCount,
        taskCount: thisMonthTasks.total,
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
    "/upload-file",
    sessionMiddleware,
    zValidator("form", fileUploadSchema),
    async (c) => {
      const storage = c.get("storage");
      const databases = c.get("databases");
      const { file, projectId } = c.req.valid("form");

      if (!file) {
        return c.json({ error: "File is required" }, 400);
      }

      try {
        const project = await databases.getDocument(
          DATABASE_ID,
          PROJECTS_ID,
          projectId,
        );

        if (!project) {
          return c.json({ error: "Project not found" }, 404);
        }
      } catch (error) {
        console.error("Error fetching project:", error);
        return c.json({ error: "Project not found" }, 404);
      }

      let uploadedFile;

      if (file instanceof File) {
        uploadedFile = await storage.createFile(
          IMAGES_BUCKET_ID,
          ID.unique(),
          file,
        );

        if (
          file.name.toLowerCase().endsWith(".md") ||
          file.name.toLowerCase().endsWith(".txt")
        ) {
          try {
            // Get the file content as a buffer
            const fileBuffer = await storage.getFileDownload(
              IMAGES_BUCKET_ID,
              uploadedFile.$id,
            );

            // Convert buffer to string to get the actual text content
            const fileContent = Buffer.from(fileBuffer).toString("utf-8");

            // Update the project with the actual README content
            await databases.updateDocument(
              DATABASE_ID,
              PROJECTS_ID,
              projectId,
              {
                readme: fileContent,
              },
            );

            return c.json({
              data: {
                file: uploadedFile,
                readmeContent: fileContent,
              },
            });
          } catch (error) {
            console.error("Error processing README file:", error);
          }
        }
      } else {
        return c.json({ error: "Invalid file type" }, 400);
      }
      return c.json({
        data: {
          file: uploadedFile,
        },
      });
    },
  )
  .get("/:projectId/info", sessionMiddleware, async (c) => {
    const databases = c.get("databases");
    const { projectId } = c.req.param();

    const project = await databases.getDocument<Project>(
      DATABASE_ID,
      PROJECTS_ID,
      projectId,
    );

    return c.json({
      data: {
        $id: project.$id,
        name: project.name,
        imageUrl: project.imageUrl,
        projectAdmin: project.projectAdmin,
        inviteCode: project.inviteCode,
        workspaceId: project.workspaceId,
      },
    });
  })
  .post(
    "/:workspaceId/projects/:projectId/reset-invite-code",
    sessionMiddleware,
    async (c) => {
      const databases = c.get("databases");
      const user = c.get("user");
      const { workspaceId } = c.req.param();
      const { projectId } = c.req.param();

      const member = await getMember({
        databases,
        workspaceId,
        userId: user.$id,
      });

      const existingProject = await databases.getDocument<Project>(
        DATABASE_ID,
        PROJECTS_ID,
        projectId,
      );

      if (
        !member ||
        (member.role !== MemberRole.ADMIN &&
          existingProject.projectAdmin !== member.$id)
      ) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const project = await databases.updateDocument(
        DATABASE_ID,
        PROJECTS_ID,
        projectId,
        {
          inviteCode: generateInviteCode(INVITECODE_LENGTH),
        },
      );
      return c.json({ data: project });
    },
  );

export default app;

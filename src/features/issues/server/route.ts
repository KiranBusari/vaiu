import { z } from "zod";
import { Hono } from "hono";

import { ID, Query } from "node-appwrite";
import { zValidator } from "@hono/zod-validator";
import { getMember } from "@/features/members/utilts";
import { sessionMiddleware } from "@/lib/session-middleware";

import { DATABASE_ID, MEMBERS_ID, PROJECTS_ID, TASKS_ID } from "@/config";
import { createAdminClient } from "@/lib/appwrite";

import { createTaskSchema } from "../schemas";
import { Task, TaskStatus } from "../types";
import { Project } from "@/features/projects/types";
import { Octokit } from "octokit";

const app = new Hono()
  .delete("/:issueId", sessionMiddleware, async (c) => {
    const databases = c.get("databases");
    const user = c.get("user");
    const { issueId } = c.req.param();

    const task = await databases.getDocument<Task>(
      DATABASE_ID,
      TASKS_ID,
      issueId
    );
    const member = await getMember({
      databases,
      workspaceId: task.workspaceId,
      userId: user.$id,
    });

    if (!member) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const projectId = task.projectId;

    const existingProject = await databases.getDocument<Project>(
      DATABASE_ID,
      PROJECTS_ID,
      projectId
    );

    if (!existingProject) {
      return c.json({ error: "Project not found" }, 404);
    }

    if (existingProject.projectAdmin !== member.$id) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const octokit = new Octokit({
      auth: existingProject.accessToken,
    });

    const owner = await octokit.rest.users.getAuthenticated();

    const issues = await octokit.rest.issues.listForRepo({
      owner: owner.data.login,
      repo: existingProject.name,
    });

    const currentIssue = issues.data.find((issue) => issue.title === task.name);

    if (!currentIssue) {
      return c.json({ error: "Issue not found" }, 404);
    }

    const issue_number = currentIssue.number;

    await octokit.rest.issues.update({
      owner: owner.data.login,
      repo: existingProject.name,
      issue_number: issue_number,
      state: "closed",
    });

    await databases.deleteDocument(DATABASE_ID, TASKS_ID, issueId);
    return c.json({
      success: true,
      data: {
        $id: issueId,
      },
    });
  })
  .get(
    "/",
    sessionMiddleware,
    zValidator(
      "query",
      z.object({
        workspaceId: z.string(),
        projectId: z.string().nullish(),
        assigneeId: z.string().nullish(),
        search: z.string().nullish(),
        dueDate: z.string().nullish(),
        status: z.nativeEnum(TaskStatus).nullish(),
      })
    ),
    async (c) => {
      const { users } = await createAdminClient();
      const databases = c.get("databases");
      const user = c.get("user");
      const { workspaceId, projectId, assigneeId, status, search, dueDate } =
        c.req.valid("query");

      const member = await getMember({
        databases,
        workspaceId,
        userId: user.$id,
      });

      if (!member) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const query = [
        Query.equal("workspaceId", workspaceId),
        Query.orderDesc("$createdAt"),
      ];

      if (projectId) {
        console.log("ProjectId:", projectId);
        query.push(Query.equal("projectId", projectId));
      }
      if (status) {
        console.log("status:", status);
        query.push(Query.equal("status", status));
      }
      if (assigneeId) {
        console.log("assigneeId:", assigneeId);
        query.push(Query.equal("assigneeId", assigneeId));
      }
      if (dueDate) {
        console.log("dueDate:", dueDate);
        query.push(Query.equal("dueDate", dueDate));
      }
      if (search) {
        console.log("search:", search);
        query.push(Query.search("name", search));
      }

      const tasks = await databases.listDocuments<Task>(
        DATABASE_ID,
        TASKS_ID,
        query
      );

      const projectIds = tasks.documents.map((task) => task.projectId);
      const assigneeIds = tasks.documents.map((task) => task.assigneeId);

      const projects = await databases.listDocuments<Project>(
        DATABASE_ID,
        PROJECTS_ID,
        projectIds.length > 0 ? [Query.contains("$id", projectIds)] : []
      );

      const members = await databases.listDocuments(
        DATABASE_ID,
        MEMBERS_ID,
        assigneeIds.length > 0 ? [Query.contains("$id", assigneeIds)] : []
      );

      const assignees = await Promise.all(
        members.documents.map(async (member) => {
          try {
            const user = await users.get(member.userId);
            return {
              ...member,
              name: user.name || user.email,
              email: user.email,
            };
          } catch (error) {
            if (
              typeof error === "object" &&
              error &&
              "code" in error &&
              error.code === 404
            ) {
              // User not found in Appwrite
              return {
                ...member,
                name: "Unknown User",
                email: "user-not-found@example.com",
              };
            }
            console.error(`Error fetching user ${member.userId}:`, error);
            return {
              ...member,
              name: "Error Fetching User",
              email: "error@example.com",
            };
          }
        })
      );

      const populatedTask = tasks.documents.map((task) => {
        const project = projects.documents.find(
          (project) => project.$id === task.projectId
        );
        const assignee = assignees.find(
          (assignee) => assignee.$id === task.assigneeId
        );
        return {
          ...task,
          project,
          assignee,
        };
      });

      return c.json({
        data: {
          ...tasks,
          documents: populatedTask,
        },
      });
    }
  )
  .post(
    "/",
    sessionMiddleware,
    zValidator("json", createTaskSchema),
    async (c) => {
      try {
        const databases = c.get("databases");
        const user = c.get("user");
        const { name, status, dueDate, projectId, assigneeId, workspaceId } =
          c.req.valid("json");

        const projects = await databases.listDocuments(
          DATABASE_ID,
          PROJECTS_ID,
          [
            Query.equal("$id", projectId),
            Query.equal("workspaceId", workspaceId),
          ]
        );
        // console.log("projects:", projects);

        const { accessToken } = projects.documents.filter(
          (project) => project.$id === projectId
        )[0];

        if (!accessToken) {
          return c.json({ error: "Workspace not found" }, 404);
        }

        const fetchAssinee = await databases.getDocument(
          DATABASE_ID,
          MEMBERS_ID,
          assigneeId
        );

        if (!fetchAssinee) {
          return c.json({ error: "Assignee not found" }, 404);
        }

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

        if (projects.documents[0].projectAdmin !== member.$id) {
          return c.json({ error: "Only Admins can create Issues" }, 403);
        }

        const highestPositionTask = await databases.listDocuments(
          DATABASE_ID,
          TASKS_ID,
          [
            Query.equal("status", status),
            Query.equal("workspaceId", workspaceId),
            Query.orderAsc("position"),
            Query.limit(1),
          ]
        );
        const newPosition =
          highestPositionTask.documents.length > 0
            ? highestPositionTask.documents[0].position + 1000
            : 1000;

        const owner = await octokit.rest.users.getAuthenticated();

        const issueInGit = await octokit.rest.issues.create({
          owner: owner.data.login,
          repo: projects.documents[0].name,
          title: name,
          body: "This is a test task",
        });

        const task = await databases.createDocument<Task>(
          DATABASE_ID,
          TASKS_ID,
          ID.unique(),
          {
            name,
            status,
            dueDate,
            workspaceId,
            projectId,
            assigneeId,
            position: newPosition,
          }
        );

        return c.json({ data: task, issue: issueInGit });
      } catch (error) {
        console.error("Error:", error);
      }
    }
  )
  .patch(
    "/:issueId",
    sessionMiddleware,
    zValidator("json", createTaskSchema.partial()),
    async (c) => {
      const databases = c.get("databases");
      const user = c.get("user");
      const { name, status, dueDate, projectId, assigneeId, description } =
        c.req.valid("json");
      const { issueId } = c.req.param();

      const exisistingTask = await databases.getDocument<Task>(
        DATABASE_ID,
        TASKS_ID,
        issueId
      );

      const member = await getMember({
        databases,
        workspaceId: exisistingTask.workspaceId,
        userId: user.$id,
      });

      if (!member) {
        return c.json({ error: "Unauthorized" }, 401);
      }
      const task = await databases.updateDocument<Task>(
        DATABASE_ID,
        TASKS_ID,
        issueId,
        {
          name,
          status,
          dueDate,
          projectId,
          assigneeId,
          description,
        }
      );
      return c.json({ data: task });
    }
  )
  .get("/:issueId", sessionMiddleware, async (c) => {
    const { users } = await createAdminClient();
    const currentUser = c.get("user");
    const { issueId } = c.req.param();
    const databases = c.get("databases");

    const task = await databases.getDocument<Task>(
      DATABASE_ID,
      TASKS_ID,
      issueId
    );
    const currentMember = await getMember({
      databases,
      workspaceId: task.workspaceId,
      userId: currentUser.$id,
    });
    if (!currentMember) {
      return c.json({ error: "Unauthorized" }, 401);
    }
    const project = await databases.getDocument<Project>(
      DATABASE_ID,
      PROJECTS_ID,
      task.projectId
    );
    const member = await databases.getDocument(
      DATABASE_ID,
      MEMBERS_ID,
      task.assigneeId
    );

    let assignee;
    try {
      const user = await users.get(member.userId);
      assignee = {
        ...member,
        name: user.name || user.email,
        email: user.email,
      };
    } catch (error) {
      if (
        typeof error === "object" &&
        error &&
        "code" in error &&
        error.code === 404
      ) {
        // User not found in Appwrite
        assignee = {
          ...member,
          name: "Unknown User",
          email: "user-not-found@example.com",
        };
      } else {
        console.error(`Error fetching user ${member.userId}:`, error);
        assignee = {
          ...member,
          name: "Error Fetching User",
          email: "error@example.com",
        };
      }
    }

    return c.json({
      data: {
        ...task,
        project,
        assignee,
      },
    });
  })
  .post(
    "/bulk-update",
    sessionMiddleware,
    zValidator(
      "json",
      z.object({
        tasks: z.array(
          z.object({
            $id: z.string(),
            status: z.nativeEnum(TaskStatus),
            position: z.number().int().positive().min(1000).max(1_000_000),
          })
        ),
      })
    ),
    async (c) => {
      const databases = c.get("databases");
      const user = c.get("user");
      const { tasks } = c.req.valid("json");

      const taskToUpdate = await databases.listDocuments<Task>(
        DATABASE_ID,
        TASKS_ID,
        [
          Query.contains(
            "$id",
            tasks.map((task) => task.$id)
          ),
        ]
      );
      const workspaceIds = new Set(
        taskToUpdate.documents.map((task) => task.workspaceId)
      );

      if (workspaceIds.size !== 1) {
        return c.json({
          error: "All tasks must belong to the same workspace",
        });
      }
      const workspaceId = workspaceIds.values().next().value;
      if (!workspaceId) {
        return c.json({ error: "Workspace Id is required" }, 400);
      }

      const member = await getMember({
        databases,
        workspaceId,
        userId: user.$id,
      });
      if (!member) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const updatedTasks = await Promise.all(
        tasks.map(async (task) => {
          const { $id, position, status } = task;
          return databases.updateDocument<Task>(DATABASE_ID, TASKS_ID, $id, {
            status,
            position,
          });
        })
      );

      return c.json({ data: updatedTasks });
    }
  );

export default app;

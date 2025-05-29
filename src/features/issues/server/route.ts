import { z } from "zod";
import { Hono } from "hono";

import { ID, Query } from "node-appwrite";
import { zValidator } from "@hono/zod-validator";
import { getMember } from "@/features/members/utilts";
import { sessionMiddleware } from "@/lib/session-middleware";

import { DATABASE_ID, MEMBERS_ID, PROJECTS_ID, ISSUES_ID } from "@/config";
import { createAdminClient } from "@/lib/appwrite";

import { createTaskSchema } from "../schemas";
import { Issue, IssueStatus } from "../types";
import { Project } from "@/features/projects/types";
import { Member } from "@/features/members/types";
import { Octokit } from "octokit";

function getRandomFutureDate(): string {
  /**
   * Generates a random date string in the future, at least 7 days from the current date,
   * and no more than 2 months from the current date.
   * @returns A string representing a random date in the future, in ISO format.
   **/

  const today = new Date();
  const oneWeekFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 days minimum
  const twoMonthsFromNow = new Date();
  twoMonthsFromNow.setMonth(today.getMonth() + 2);

  const randomDate = new Date(
    oneWeekFromNow.getTime() +
      Math.random() * (twoMonthsFromNow.getTime() - oneWeekFromNow.getTime()),
  );

  return randomDate.toISOString();
}

const app = new Hono()
  .delete("/:issueId", sessionMiddleware, async (c) => {
    const databases = c.get("databases");
    const user = c.get("user");
    const { issueId } = c.req.param();

    const issuesFromDb = await databases.getDocument<Issue>(
      DATABASE_ID,
      ISSUES_ID,
      issueId,
    );

    // console.log("Issues from DB:", issuesFromDb);

    const member = await getMember({
      databases,
      workspaceId: issuesFromDb.workspaceId,
      userId: user.$id,
    });

    if (!member) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const projectId = issuesFromDb.projectId;

    const existingProject = await databases.getDocument<Project>(
      DATABASE_ID,
      PROJECTS_ID,
      projectId,
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

    const issuesFromGit = await octokit.rest.issues.listForRepo({
      owner: owner.data.login,
      repo: existingProject.name,
    });
    // console.log("Issues from Git:", issuesFromGit);

    const currentIssue = issuesFromGit.data.find(
      (issue) => issue.title === issuesFromDb.name,
    );

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

    await databases.deleteDocument(DATABASE_ID, ISSUES_ID, issueId);
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
        status: z.nativeEnum(IssueStatus).nullish(),
      }),
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
        // console.log("ProjectId:", projectId);
        query.push(Query.equal("projectId", projectId));
      }
      if (status) {
        // console.log("status:", status);
        query.push(Query.equal("status", status));
      }
      if (assigneeId) {
        // console.log("assigneeId:", assigneeId);
        query.push(Query.equal("assigneeId", assigneeId));
      }
      if (dueDate) {
        // console.log("dueDate:", dueDate);
        query.push(Query.equal("dueDate", dueDate));
      }
      if (search) {
        // console.log("search:", search);
        query.push(Query.search("name", search));
      }

      const issues = await databases.listDocuments<Issue>(
        DATABASE_ID,
        ISSUES_ID,
        query,
      );

      const projectIds = issues.documents.map((issue) => issue.projectId);
      const assigneeIds = issues.documents.map((issue) => issue.assigneeId);

      /* TODO: Need to be checked and verified the correct way to update the issues storing in the projects */
      // const projects = await databases.listDocuments<Project>(
      //   DATABASE_ID,
      //   PROJECTS_ID,
      //   projectIds.length > 0 ? [Query.contains("$id", projectIds)] : [],
      // );

      // const members = await databases.listDocuments(
      //   DATABASE_ID,
      //   MEMBERS_ID,
      //   assigneeIds.length > 0 ? [Query.contains("$id", assigneeIds)] : [],
      // );

      let allProjects: (Project | null)[] = [];
      if (projectIds.length > 0) {
        const projectPromises = projectIds.map((id) =>
          databases.getDocument<Project>(DATABASE_ID, PROJECTS_ID, id),
        );
        allProjects = await Promise.all(
          projectPromises.map((p) => p.catch(() => null)),
        );
      }
      const projects = {
        documents: allProjects.filter(Boolean),
      };

      let allMembers: (Member | null)[] = [];
      if (assigneeIds.length > 0) {
        const memberPromises = assigneeIds.map((id) =>
          databases.getDocument<Member>(DATABASE_ID, MEMBERS_ID, id),
        );
        allMembers = await Promise.all(
          memberPromises.map((p) => p.catch(() => null)),
        );
      }
      const members = {
        documents: allMembers.filter(Boolean),
      };

      const assignees = await Promise.all(
        members.documents.map(async (member) => {
          if (!member) {
            throw new Error("Member not found");
          }
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
        }),
      );

      const populatedTask = issues.documents.map((issue) => {
        const project = projects.documents.find(
          (project) => project && project.$id === issue.projectId,
        );
        const assignee = assignees.find(
          (assignee) => assignee.$id === issue.assigneeId,
        );
        return {
          ...issue,
          project,
          assignee,
        };
      });

      return c.json({
        data: {
          ...issues,
          documents: populatedTask,
        },
      });
    },
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
          ],
        );
        // console.log("projects:", projects);

        const { accessToken } = projects.documents.filter(
          (project) => project.$id === projectId,
        )[0];

        if (!accessToken) {
          return c.json({ error: "Workspace not found" }, 404);
        }

        const fetchAssinee = await databases.getDocument(
          DATABASE_ID,
          MEMBERS_ID,
          assigneeId,
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

        const owner = await octokit.rest.users.getAuthenticated();

        const issueInGit = await octokit.rest.issues.create({
          owner: owner.data.login,
          repo: projects.documents[0].name,
          title: name,
          body: "",
        });

        const issue = await databases.createDocument<Issue>(
          DATABASE_ID,
          ISSUES_ID,
          ID.unique(),
          {
            name,
            status,
            dueDate,
            workspaceId,
            projectId,
            assigneeId,
            position: newPosition,
          },
        );

        return c.json({ data: issue, issue: issueInGit });
      } catch (error) {
        console.error("Error:", error);
        if (error instanceof Error) {
          return c.json({ error: error.message }, 500);
        }
        return c.json({ error: "An unexpected error occurred" }, 500);
      }
    },
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

      const exisistingTask = await databases.getDocument<Issue>(
        DATABASE_ID,
        ISSUES_ID,
        issueId,
      );

      const member = await getMember({
        databases,
        workspaceId: exisistingTask.workspaceId,
        userId: user.$id,
      });

      if (!member) {
        return c.json({ error: "Unauthorized" }, 401);
      }
      const issue = await databases.updateDocument<Issue>(
        DATABASE_ID,
        ISSUES_ID,
        issueId,
        {
          name,
          status,
          dueDate,
          projectId,
          assigneeId,
          description,
        },
      );
      return c.json({ data: issue });
    },
  )
  .get("/:issueId", sessionMiddleware, async (c) => {
    const { users } = await createAdminClient();
    const currentUser = c.get("user");
    const { issueId } = c.req.param();
    const databases = c.get("databases");

    const issue = await databases.getDocument<Issue>(
      DATABASE_ID,
      ISSUES_ID,
      issueId,
    );
    const currentMember = await getMember({
      databases,
      workspaceId: issue.workspaceId,
      userId: currentUser.$id,
    });
    if (!currentMember) {
      return c.json({ error: "Unauthorized" }, 401);
    }
    const project = await databases.getDocument<Project>(
      DATABASE_ID,
      PROJECTS_ID,
      issue.projectId,
    );
    const member = await databases.getDocument(
      DATABASE_ID,
      MEMBERS_ID,
      issue.assigneeId,
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
        ...issue,
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
        issues: z.array(
          z.object({
            $id: z.string(),
            status: z.nativeEnum(IssueStatus),
            position: z.number().int().positive().min(1000).max(1_000_000),
          }),
        ),
      }),
    ),
    async (c) => {
      const databases = c.get("databases");
      const user = c.get("user");
      const { issues } = c.req.valid("json");

      // const issueToUpdate = await databases.listDocuments<Task>(
      //   DATABASE_ID,
      //   ISSUES_ID,
      //   [
      //     Query.contains(
      //       "$id",
      //       issues.map((issue) => issue.$id),
      //     ),
      //   ],
      // );

      const issuePromises = issues.map((issue) =>
        databases.getDocument<Issue>(DATABASE_ID, ISSUES_ID, issue.$id),
      );
      const issueToUpdate = {
        documents: (
          await Promise.all(issuePromises.map((p) => p.catch(() => null)))
        ).filter(Boolean),
      };
      const workspaceIds = new Set(
        issueToUpdate.documents.map((issue) => issue?.workspaceId),
      );

      if (workspaceIds.size !== 1) {
        return c.json(
          {
            error: "All issues must belong to the same workspace",
          },
          400,
        );
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
        issues.map(async (issue) => {
          const { $id, position, status } = issue;
          return databases.updateDocument<Issue>(DATABASE_ID, ISSUES_ID, $id, {
            status,
            position,
          });
        }),
      );

      return c.json({ data: updatedTasks });
    },
  )
  .post(
    "/fetch-issues",
    sessionMiddleware,
    zValidator("json", z.object({ projectId: z.string().nullish() })),
    async (c) => {
      try {
        const { projectId } = c.req.valid("json");
        const databases = c.get("databases");
        console.log("ProjectId:", projectId);

        if (!projectId) {
          return c.json({ error: "Project ID is required" }, 400);
        }

        const project = await databases.getDocument<Project>(
          DATABASE_ID,
          PROJECTS_ID,
          projectId,
        );
        console.log("Project:", project);

        const octokit = new Octokit({
          auth: project.accessToken,
        });

        const owner = await octokit.rest.users.getAuthenticated();

        const issuesFromGit = await octokit.rest.issues.listForRepo({
          owner: owner.data.login,
          repo: project.name,
        });

        console.log("Issues from Git:", issuesFromGit.data);

        const issuesFromDb = await databases.listDocuments<Issue>(
          DATABASE_ID,
          ISSUES_ID,
          [Query.equal("projectId", projectId)],
        );

        console.log("Issues from DB:", issuesFromDb.documents);

        const issuesToCreate = issuesFromGit.data.filter((gitIssue) => {
          // Only process open issues from GitHub
          if (gitIssue.state !== "open") return false;

          // TODO: Need to discuss if same issue need to be allowed to create again

          // Check if issue already exists in DB by matching title
          return !issuesFromDb.documents.some(
            (dbIssue) => dbIssue.name === gitIssue.title,
          );
        });

        console.log("Issues to create:", issuesToCreate);

        const newIssues = await Promise.all(
          issuesToCreate.map((issue) =>
            databases.createDocument(DATABASE_ID, ISSUES_ID, ID.unique(), {
              name: issue.title,
              status: IssueStatus.TODO,
              workspaceId: project.workspaceId,
              projectId: projectId,
              assigneeId: issue.assignee?.login,
              dueDate: getRandomFutureDate(),
              position: 1000,
              description: issue.body || "",
            }),
          ),
        );

        console.log("New Issues:", newIssues);

        return c.json({
          data: issuesFromGit,
          created: newIssues,
        });
      } catch (error) {
        console.log("Error:", error);
        return c.json({ error: "An unexpected error occurred" }, 500);
      }
    },
  );

export default app;

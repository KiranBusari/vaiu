import { z } from "zod";
import { Hono } from "hono";

import { ID, Query } from "node-appwrite";
import { zValidator } from "@hono/zod-validator";
import { getMember, isSuperAdmin } from "@/features/members/utilts";
import { sessionMiddleware } from "@/lib/session-middleware";

import {
  DATABASE_ID,
  MEMBERS_ID,
  PROJECTS_ID,
  ISSUES_ID,
  COMMENTS_ID,
  IMAGES_BUCKET_ID,
} from "@/config";
import { createAdminClient } from "@/lib/appwrite";

import { createCommentSchema, createTaskSchema } from "../schemas";
import { Issue, IssueStatus } from "../types";
import { Project } from "@/features/projects/types";
import { Member } from "@/features/members/types";
import {
  getAccessToken,
  getAuthenticatedUser,
  listRepositoryIssues,
  updateIssue,
  createIssue,
  checkCollaborator,
} from "@/lib/github-api";

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

    const projectId = issuesFromDb.projectId;
    const existingProject = await databases.getDocument<Project>(
      DATABASE_ID,
      PROJECTS_ID,
      projectId,
    );

    if (!existingProject) {
      return c.json({ error: "Project not found" }, 404);
    }

    // Check if user is a super admin
    const isSuper = await isSuperAdmin({ databases, userId: user.$id });

    if (!isSuper) {
      // Regular user: check member permissions
      const member = await getMember({
        databases,
        workspaceId: issuesFromDb.workspaceId,
        userId: user.$id,
      });

      if (!member) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      // Check if user is a member of the project
      const userProjectIds = member.projectId || [];
      if (!userProjectIds.includes(projectId)) {
        return c.json({ error: "Unauthorized to delete this issue" }, 403);
      }
    }

    // Get GitHub OAuth access token
    const githubToken = await getAccessToken(user.$id);
    if (!githubToken) {
      return c.json(
        {
          error: "GitHub account not connected. Cannot delete issue.",
        },
        400,
      );
    }

    const owner = await getAuthenticatedUser(githubToken);
    if (!owner) {
      return c.json({ error: "Failed to authenticate with GitHub" }, 500);
    }

    const issuesFromGit = await listRepositoryIssues(
      githubToken,
      owner.login,
      existingProject.name,
    );
    // console.log("Issues from Git:", issuesFromGit);

    const currentIssue = issuesFromGit.find(
      (issue) => issue.title === issuesFromDb.name,
    );

    if (!currentIssue) {
      return c.json({ error: "Issue not found" }, 404);
    }

    const issue_number = currentIssue.number;

    await updateIssue(
      githubToken,
      owner.login,
      existingProject.name,
      issue_number,
      { state: "closed" },
    );

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

      // Check if user is a super admin
      const isSuper = await isSuperAdmin({ databases, userId: user.$id });

      let userProjectIds: string[] = [];

      if (!isSuper) {
        // Regular users need to be members of the workspace
        const member = await getMember({
          databases,
          workspaceId,
          userId: user.$id,
        });

        if (!member) {
          return c.json({ error: "Unauthorized" }, 401);
        }

        // Get the projects the user is a member of
        userProjectIds = member.projectId || [];
      } else {
        // Super admins can see all projects in the workspace
        const allProjects = await databases.listDocuments(
          DATABASE_ID,
          PROJECTS_ID,
          [Query.equal("workspaceId", workspaceId)],
        );
        userProjectIds = allProjects.documents.map((project) => project.$id);
      }

      // If user is not a member of any projects, return empty result
      if (userProjectIds.length === 0) {
        return c.json({
          data: {
            total: 0,
            documents: [],
          },
        });
      }

      const query = [
        Query.equal("workspaceId", workspaceId),
        Query.orderDesc("$createdAt"),
      ];

      // Filter by projects the user is a member of
      if (projectId) {
        // Check if user is a member of the requested project
        if (!userProjectIds.includes(projectId)) {
          return c.json({ error: "Unauthorized access to this project" }, 403);
        }
        query.push(Query.equal("projectId", projectId));
      } else {
        // Only show issues from projects the user is a member of
        query.push(Query.contains("projectId", userProjectIds));
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
        const {
          name,
          description,
          status,
          dueDate,
          projectId,
          assigneeId,
          workspaceId,
        } = c.req.valid("json");

        const projects = await databases.listDocuments(
          DATABASE_ID,
          PROJECTS_ID,
          [
            Query.equal("$id", projectId),
            Query.equal("workspaceId", workspaceId),
          ],
        );

        if (projects.documents.length === 0) {
          return c.json({ error: "Project not found" }, 404);
        }

        const fetchAssinee = await databases.getDocument(
          DATABASE_ID,
          MEMBERS_ID,
          assigneeId,
        );

        if (!fetchAssinee) {
          return c.json({ error: "Assignee not found" }, 404);
        }

        // Get GitHub OAuth access token
        const githubToken = await getAccessToken(user.$id);
        if (!githubToken) {
          return c.json(
            {
              error: "GitHub account not connected. Cannot create issue.",
            },
            400,
          );
        }

        // Check if user is a super admin
        const isSuper = await isSuperAdmin({ databases, userId: user.$id });

        if (!isSuper) {
          const member = await getMember({
            databases,
            workspaceId,
            userId: user.$id,
          });

          if (!member) {
            return c.json({ error: "Unauthorized" }, 401);
          }

          // Check if user is a member of the project they're trying to create an issue for
          const userProjectIds = member.projectId || [];
          if (!userProjectIds.includes(projectId)) {
            return c.json(
              { error: "Unauthorized access to this project" },
              403,
            );
          }
        }

        // Get authenticated GitHub user
        const authenticatedGithubUser = await getAuthenticatedUser(githubToken);
        if (!authenticatedGithubUser) {
          return c.json({ error: "Failed to authenticate with GitHub" }, 500);
        }

        // Check if user is a collaborator on the repository
        const isCollaborator = await checkCollaborator(
          githubToken,
          authenticatedGithubUser.login,
          projects.documents[0].name,
          authenticatedGithubUser.login
        );

        if (!isCollaborator) {
          return c.json({
            error: "You must be a collaborator on this repository to create issues"
          }, 403);
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

        const issueInGit = await createIssue(
          githubToken,
          authenticatedGithubUser.login,
          projects.documents[0].name,
          name,
          description || "",
        );

        // Idempotency guard: if an issue with the same GitHub number already exists for this project, return it
        const existingByNumber = await databases
          .listDocuments<Issue>(DATABASE_ID, ISSUES_ID, [
            Query.equal("projectId", projectId),
            Query.equal("number", issueInGit.number),
          ])
          .catch(() => ({ documents: [] as Issue[] }));

        if (existingByNumber.documents.length > 0) {
          return c.json({
            data: existingByNumber.documents[0],
            issue: issueInGit,
          });
        }

        const issue = await databases.createDocument<Issue>(
          DATABASE_ID,
          ISSUES_ID,
          ID.unique(),
          {
            name,
            description,
            status,
            dueDate,
            workspaceId,
            projectId,
            assigneeId,
            position: newPosition,
            number: issueInGit.number,
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
      const {
        name,
        status,
        dueDate,
        projectId,
        assigneeId,
        description,
        comment,
      } = c.req.valid("json");
      const { issueId } = c.req.param();

      const exisistingTask = await databases.getDocument<Issue>(
        DATABASE_ID,
        ISSUES_ID,
        issueId,
      );

      // Check if user is a super admin
      const isSuper = await isSuperAdmin({ databases, userId: user.$id });

      if (!isSuper) {
        const member = await getMember({
          databases,
          workspaceId: exisistingTask.workspaceId,
          userId: user.$id,
        });

        if (!member) {
          return c.json({ error: "Unauthorized" }, 401);
        }

        // Check if user is a member of the project that this issue belongs to
        const userProjectIds = member.projectId || [];
        if (!userProjectIds.includes(exisistingTask.projectId)) {
          return c.json(
            { error: "Unauthorized access to this project's issue" },
            403,
          );
        }

        // If projectId is being changed, ensure user is also a member of the new project
        if (
          projectId &&
          projectId !== exisistingTask.projectId &&
          !userProjectIds.includes(projectId)
        ) {
          return c.json(
            { error: "Unauthorized access to the target project" },
            403,
          );
        }
      }

      // Require comment when moving to IN_REVIEW or DONE status
      if (status === "IN_REVIEW" && !comment) {
        return c.json(
          { error: "Comment is required when moving issue to In Review" },
          400,
        );
      }

      if (status === "DONE" && !comment) {
        return c.json(
          { error: "Comment is required when moving issue to Done" },
          400,
        );
      }

      // Create comment when moving to IN_REVIEW or DONE
      if ((status === "IN_REVIEW" || status === "DONE") && comment) {
        await databases.createDocument(DATABASE_ID, COMMENTS_ID, ID.unique(), {
          text: comment,
          issueId,
          userId: user.$id,
        });
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

      // Sync status changes to GitHub
      try {
        const project = await databases.getDocument<Project>(
          DATABASE_ID,
          PROJECTS_ID,
          issue.projectId,
        );

        // Get GitHub OAuth access token
        const githubToken = await getAccessToken(user.$id);

        if (githubToken) {
          const owner = await getAuthenticatedUser(githubToken);

          if (owner) {
            const issuesFromGit = await listRepositoryIssues(
              githubToken,
              owner.login,
              project.name,
              "all", // Get both open and closed issues
            );

            // Find the GitHub issue by title
            const githubIssue = issuesFromGit.find(
              (gitIssue) => gitIssue.title === issue.name,
            );

            if (githubIssue) {
              const newState = status === "DONE" ? "closed" : "open";

              // Only update if the state actually changed
              if (
                (newState === "closed" && githubIssue.state === "open") ||
                (newState === "open" && githubIssue.state === "closed")
              ) {
                await updateIssue(
                  githubToken,
                  owner.login,
                  project.name,
                  githubIssue.number,
                  { state: newState },
                );
                console.log(
                  `Updated GitHub issue #${githubIssue.number} state to ${newState}`,
                );
              }
            }
          }
        }
      } catch (error) {
        console.error("Error syncing to GitHub:", error);
      }

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

    // Check if user is a super admin
    const isSuper = await isSuperAdmin({ databases, userId: currentUser.$id });

    if (!isSuper) {
      const currentMember = await getMember({
        databases,
        workspaceId: issue.workspaceId,
        userId: currentUser.$id,
      });
      if (!currentMember) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      // Check if user is a member of the project that this issue belongs to
      const userProjectIds = currentMember.projectId || [];
      if (!userProjectIds.includes(issue.projectId)) {
        return c.json(
          { error: "Unauthorized access to this project's issue" },
          403,
        );
      }
    }

    const project = await databases.getDocument<Project>(
      DATABASE_ID,
      PROJECTS_ID,
      issue.projectId,
    );

    let assignee;
    try {
      const member = await databases.getDocument(
        DATABASE_ID,
        MEMBERS_ID,
        issue.assigneeId,
      );

      try {
        const user = await users.get(member.userId);
        assignee = {
          ...member,
          name: user.name || user.email,
          email: user.email,
        };
      } catch (userError) {
        if (
          typeof userError === "object" &&
          userError &&
          "code" in userError &&
          userError.code === 404
        ) {
          // User not found in Appwrite
          assignee = {
            ...member,
            name: "Unknown User",
            email: "user-not-found@example.com",
          };
        } else {
          console.error(`Error fetching user ${member.userId}:`, userError);
          assignee = {
            ...member,
            name: "Error Fetching User",
            email: "error@example.com",
          };
        }
      }
    } catch {
      // If member not found by ID, it might be a GitHub username from fetched issues
      console.log(
        `Member not found by ID ${issue.assigneeId}, treating as GitHub username`,
      );

      // Create a fallback assignee object for GitHub usernames
      assignee = {
        $id: issue.assigneeId || "unknown",
        userId: issue.assigneeId || "unknown",
        workspaceId: issue.workspaceId,
        name: issue.assigneeId || "Unassigned",
        email: `${issue.assigneeId}@github.local`,
        $createdAt: new Date().toISOString(),
        $updatedAt: new Date().toISOString(),
        $permissions: [],
        $collectionId: MEMBERS_ID,
        $databaseId: DATABASE_ID,
      };
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

      // Check if user is a super admin
      const isSuper = await isSuperAdmin({ databases, userId: user.$id });
      let member = null;

      if (!isSuper) {
        member = await getMember({
          databases,
          workspaceId,
          userId: user.$id,
        });
        if (!member) {
          return c.json({ error: "Unauthorized" }, 401);
        }

        // Check if user is a member of all projects that contain the issues being updated
        const userProjectIds = member.projectId || [];
        const issueProjectIds = new Set(
          issueToUpdate.documents
            .map((issue) => issue?.projectId)
            .filter(Boolean),
        );

        const unauthorizedProjects = Array.from(issueProjectIds).filter(
          (projectId) => projectId && !userProjectIds.includes(projectId),
        );

        if (unauthorizedProjects.length > 0) {
          return c.json(
            {
              error: "Unauthorized access to some project issues",
              unauthorizedProjects,
            },
            403,
          );
        }
      }

      for (const update of issues) {
        const existing = issueToUpdate.documents.find(
          (i) => i && i.$id === update.$id,
        );
        if (!existing) {
          continue;
        }

        const isMovingToDone =
          update.status === "DONE" && existing.status !== "DONE";
        const isMovingToReview =
          update.status === "IN_REVIEW" && existing.status !== "IN_REVIEW";

        // Check permissions for moving to DONE (only super admin or admin can do this)
        if (isMovingToDone && !isSuper && member?.role !== "ADMIN") {
          return c.json({ error: "Only Admin can move issue to Done" }, 403);
        }

        // Note: Moving to IN_REVIEW doesn't require admin permissions, but it would require
        // a comment in the individual PATCH route. Bulk update doesn't support comments.
        if (isMovingToReview) {
          return c.json(
            {
              error:
                "Moving to In Review requires a comment. Please add a comment.",
            },
            400,
          );
        }

        if (isMovingToDone && (isSuper || member?.role === "ADMIN")) {
          const project = await databases.getDocument<Project>(
            DATABASE_ID,
            PROJECTS_ID,
            existing.projectId,
          );

          // Get GitHub OAuth access token
          const githubToken = await getAccessToken(user.$id);

          if (githubToken) {
            const owner = await getAuthenticatedUser(githubToken);

            if (owner) {
              const issuesFromGit = await listRepositoryIssues(
                githubToken,
                owner.login,
                project.name,
              );

              const currentIssue = issuesFromGit.find(
                (issue) => issue.title === existing.name,
              );

              if (!currentIssue) {
                return c.json({ error: "Issue not found" }, 404);
              }

              if (currentIssue) {
                await updateIssue(
                  githubToken,
                  owner.login,
                  project.name,
                  currentIssue.number,
                  { state: "closed" },
                );
              }
            }
          }
        }
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
        const user = c.get("user");
        console.log("ProjectId:", projectId);

        if (!projectId) {
          return c.json({ error: "Project ID is required" }, 400);
        }

        const project = await databases.getDocument<Project>(
          DATABASE_ID,
          PROJECTS_ID,
          projectId,
        );

        // Check if user is a super admin
        const isSuper = await isSuperAdmin({ databases, userId: user.$id });

        if (!isSuper) {
          // Check if user is a member of the workspace and project
          const member = await getMember({
            databases,
            workspaceId: project.workspaceId,
            userId: user.$id,
          });

          if (!member) {
            return c.json({ error: "Unauthorized" }, 401);
          }

          // Check if user is a member of the project
          const userProjectIds = member.projectId || [];
          if (!userProjectIds.includes(projectId)) {
            return c.json(
              { error: "Unauthorized access to this project" },
              403,
            );
          }

          // Only project admins can fetch issues from GitHub
          if (project.projectAdmin !== member.$id) {
            return c.json(
              { error: "Only project admins can fetch issues from GitHub" },
              403,
            );
          }
        }

        // Get GitHub OAuth access token
        const githubToken = await getAccessToken(user.$id);

        if (!githubToken) {
          return c.json(
            {
              error: "GitHub account not connected. Cannot fetch issues.",
            },
            400,
          );
        }

        const owner = await getAuthenticatedUser(githubToken);

        if (!owner) {
          return c.json({ error: "Failed to authenticate with GitHub" }, 500);
        }

        const issuesFromGit = await listRepositoryIssues(
          githubToken,
          owner.login,
          project.name,
          "all", // Get both open and closed issues for sync
        );

        const issuesFromDb = await databases.listDocuments<Issue>(
          DATABASE_ID,
          ISSUES_ID,
          [Query.equal("projectId", projectId)],
        );

        // Check for new issues to create (only open issues)
        const openIssuesFromGit = issuesFromGit.filter(
          (issue) => issue.state === "open",
        );

        const issuesToCreate = openIssuesFromGit.filter((gitIssue) => {
          return !issuesFromDb.documents.some(
            (dbIssue) =>
              dbIssue.number === gitIssue.number ||
              dbIssue.name === gitIssue.title,
          );
        });

        // Check for status updates (GitHub issues that were closed should be marked as DONE)
        const issuesToUpdate = issuesFromDb.documents.filter((dbIssue) => {
          const gitIssue = issuesFromGit.find(
            (issue) =>
              issue.number === dbIssue.number || issue.title === dbIssue.name,
          );

          if (gitIssue) {
            // Only update if GitHub issue is closed but DB issue is not DONE
            if (
              gitIssue.state === "closed" &&
              dbIssue.status !== IssueStatus.DONE
            ) {
              return true;
            }
            // Only update if GitHub issue is reopened AND the DB issue was marked as DONE
            // This prevents overwriting IN_PROGRESS, IN_REVIEW, etc.
            if (
              gitIssue.state === "open" &&
              dbIssue.status === IssueStatus.DONE
            ) {
              return true;
            }
            // If DB issue is missing the number, update it (metadata only)
            if (!dbIssue.number && gitIssue.number) {
              return true;
            }
          }
          return false;
        });

        // Update existing issues with status changes
        const updatedIssues = await Promise.all(
          issuesToUpdate.map(async (dbIssue) => {
            const gitIssue = issuesFromGit.find(
              (issue) =>
                issue.number === dbIssue.number || issue.title === dbIssue.name,
            );

            if (gitIssue) {
              const updates: Partial<Issue> = {};

              // Only update status if GitHub is closed (DB → DONE)
              // OR if DB is DONE but GitHub reopened (DONE → TODO)
              if (
                gitIssue.state === "closed" &&
                dbIssue.status !== IssueStatus.DONE
              ) {
                updates.status = IssueStatus.DONE;
              } else if (
                gitIssue.state === "open" &&
                dbIssue.status === IssueStatus.DONE
              ) {
                // Reopened issue: revert from DONE to TODO only
                updates.status = IssueStatus.TODO;
              }

              // Update number if missing
              if (!dbIssue.number && gitIssue.number) {
                updates.number = gitIssue.number;
              }

              // Only update if there are changes
              if (Object.keys(updates).length > 0) {
                return databases.updateDocument(
                  DATABASE_ID,
                  ISSUES_ID,
                  dbIssue.$id,
                  updates,
                );
              }
            }
            return null;
          }),
        );

        // Helper function to find member by GitHub username
        const findMemberByGithubUsername = async (githubUsername: string) => {
          // For now, we'll just use the GitHub username as assigneeId
          // In the future, this could be enhanced to match against user profiles
          // that have GitHub usernames stored
          return githubUsername;
        };

        // Create new issues
        const newIssues = await Promise.all(
          issuesToCreate.map(async (issue) => {
            let assigneeId = null;
            if (issue.assignee?.login) {
              assigneeId = await findMemberByGithubUsername(
                issue.assignee.login,
              );
            }

            // Re-check existence by projectId + number to avoid race duplicates
            const existingWithNumber = await databases
              .listDocuments<Issue>(DATABASE_ID, ISSUES_ID, [
                Query.equal("projectId", projectId),
                Query.equal("number", issue.number),
              ])
              .catch(() => ({ documents: [] as Issue[] }));

            if (existingWithNumber.documents.length > 0) {
              return existingWithNumber.documents[0];
            }

            return databases.createDocument(
              DATABASE_ID,
              ISSUES_ID,
              ID.unique(),
              {
                name: issue.title,
                description: issue.body || "",
                status: IssueStatus.TODO,
                dueDate: getRandomFutureDate(),
                workspaceId: project.workspaceId,
                projectId: projectId,
                assigneeId: assigneeId,
                position: 1000,
                number: issue.number,
              },
            );
          }),
        );

        return c.json({
          data: issuesFromGit,
          created: newIssues.length,
          updated: updatedIssues.filter(Boolean).length,
          summary: {
            newIssues: newIssues.length,
            updatedIssues: updatedIssues.filter(Boolean).length,
            totalGitHubIssues: issuesFromGit.length,
          },
        });
      } catch (error) {
        console.log("Error:", error);
        return c.json({ error: "An unexpected error occurred" }, 500);
      }
    },
  )
  .get("/:issueId/comments", sessionMiddleware, async (c) => {
    const databases = c.get("databases");
    const { issueId } = c.req.param();

    const comments = await databases.listDocuments(DATABASE_ID, COMMENTS_ID, [
      Query.equal("issueId", issueId),
      Query.orderDesc("$createdAt"),
    ]);

    return c.json({ data: comments });
  })
  .post(
    "/:issueId/comments",
    sessionMiddleware,
    zValidator("json", createCommentSchema),
    async (c) => {
      try {
        const databases = c.get("databases");
        const user = c.get("user");
        const storage = c.get("storage");

        const { issueId } = c.req.param();
        const { text, attachment } = c.req.valid("json");

        let uploadedImage: string | undefined;

        if (attachment instanceof File) {
          const file = await storage.createFile(
            IMAGES_BUCKET_ID,
            ID.unique(),
            attachment,
          );

          const buffer: ArrayBuffer = await storage.getFilePreview(
            IMAGES_BUCKET_ID,
            file.$id,
          );

          uploadedImage = `data:image/png;base64,${Buffer.from(buffer).toString(
            "base64",
          )}`;
        }

        const comment = await databases.createDocument(
          DATABASE_ID,
          COMMENTS_ID,
          ID.unique(),
          {
            text,
            issueId,
            userId: user.$id,
            username: user.name,
            attachment: uploadedImage,
          },
        );

        return c.json({ data: comment });
      } catch (error) {
        console.error("Error creating comment:", error);
        return c.json({ error: "Failed to create comment" }, 500);
      }
    },
  );

export default app;

import { Hono } from "hono";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import { sessionMiddleware } from "@/lib/session-middleware";
import { getMember } from "@/features/members/utilts";
import { DATABASE_ID, PROJECTS_ID, PR_ID } from "@/config";
import { Project } from "@/features/projects/types";
import { Octokit } from "octokit";
import { PrStatus, PullRequest } from "../types";
import { createPrSchema } from "../schemas";
import { ID } from "node-appwrite";

const app = new Hono()
  .get(
    "/",
    sessionMiddleware,
    zValidator("query", z.object({
      workspaceId: z.string(),
      projectId: z.string(),
    })),
    async (c) => {
      const databases = c.get("databases");
      const user = c.get("user");
      const { workspaceId, projectId } = c.req.valid("query");

      const member = await getMember({
        databases,
        workspaceId,
        userId: user.$id,
      });

      if (!member) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const project = await databases.getDocument<Project>(
        DATABASE_ID,
        PROJECTS_ID,
        projectId
      );

      if (!project) {
        return c.json({ error: "Project not found" }, 404);
      }

      const octokit = new Octokit({
        auth: project.accessToken,
      });

      try {
        const { data: prsFromGit } = await octokit.rest.pulls.list({
          owner: project.owner,
          repo: project.name,
          state: "all",
        });

        const pullRequests = prsFromGit.map((pr) => {
          let status = PrStatus.OPEN;
          if (pr.state === "closed") {
            status = pr.merged_at ? PrStatus.MERGED : PrStatus.CLOSED;
          }

          return {
            $id: String(pr.id),
            title: pr.title,
            status,
            author: pr.user?.login || "unknown",
            assignee: pr.assignee?.login,
            url: pr.html_url,
            number: pr.number,
            $createdAt: pr.created_at,
            $updatedAt: pr.updated_at,
          };
        });

        return c.json({
          data: {
            documents: pullRequests,
            total: pullRequests.length,
          },
        });
      } catch (error) {
        console.error("Failed to fetch pull requests:", error);
        return c.json({ error: "Failed to fetch pull requests" }, 500);
      }
    }
  )
  .post(
    "/:projectId/submit-pull-request",
    sessionMiddleware,
    zValidator("form", createPrSchema),
    async (c) => {
      const databases = c.get("databases");
      const user = c.get("user");

      const { projectId } = c.req.param();

      const { title, description, branch, baseBranch, githubUsername } =
        c.req.valid("form");

      if (!title || !description || !branch || !baseBranch || !githubUsername) {
        return c.json(
          {
            error:
              "Title, description, branch, base branch and GitHub username are required",
          },
          400
        );
      }

      const project = await databases.getDocument<Project>(
        DATABASE_ID,
        PROJECTS_ID,
        projectId
      );

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

      try {
        // Check if the user is a collaborator
        try {
            await octokit.rest.repos.checkCollaborator({
                owner: project.owner,
                repo: project.name,
                username: githubUsername,
            });
        } catch (error: any) {
            // If the user is not a collaborator, add them
            if (error.status === 404) {
                try {
                    await octokit.rest.repos.addCollaborator({
                        owner: project.owner,
                        repo: project.name,
                        username: githubUsername,
                        permission: "push",
                    });
                } catch (addCollaboratorError) {
                    console.error("Failed to add collaborator:", addCollaboratorError);
                    return c.json({ error: "Failed to add user as a collaborator." }, 500);
                }
            } else {
                // Handle other errors from checkCollaborator
                console.error("Failed to check collaborator status:", error);
                return c.json({ error: "Failed to check collaborator status." }, 500);
            }
        }

        const createPR = await octokit.rest.pulls.create({
          owner: project.owner,
          repo: project.name,
          title: title,
          body: description,
          head: branch,
          base: baseBranch,
        });

        await octokit.rest.issues.addAssignees({
          owner: project.owner,
          repo: project.name,
          issue_number: createPR.data.number,
          assignees: [githubUsername],
        });

        await databases.createDocument(DATABASE_ID, PR_ID, ID.unique(), {
          title,
          description,
          branch,
          baseBranch,
          githubUsername,
          projectId,
        });

        return c.json(
          {
            success: true,
            data: {
              pullRequest: createPR.data,
            },
          },
          200
        );
      } catch (error: any) {
        console.error("Failed to create PR:", error);
        if (error.status === 422) {
          const response = error.response?.data;
          if (
            response?.errors?.[0]?.message?.includes(
              "A pull request already exists"
            )
          ) {
            return c.json(
              { error: "A pull request for this branch already exists." },
              422
            );
          }
        }
        return c.json({ error: "Failed to create PR" }, 500);
      }
    }
  );

export default app;

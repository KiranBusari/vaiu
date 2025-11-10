import { Hono } from "hono";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import { sessionMiddleware } from "@/lib/session-middleware";
import { getMember, isSuperAdmin } from "@/features/members/utilts";
import { DATABASE_ID, PROJECTS_ID } from "@/config";
import { Project } from "@/features/projects/types";
import { Octokit } from "octokit";
import { generateAISummary, SummaryInput } from "@/lib/ai-service";
import { getAccessToken } from "@/lib/github-api";

const app = new Hono()
  .post("/generate",
    sessionMiddleware,
    zValidator("json", z.object({
      workspaceId: z.string(),
      projectId: z.string(),
      type: z.enum(["pr", "issue"]),
      identifier: z.union([z.string(), z.number()]), // PR number or issue number
    })),
    async (c) => {
      const databases = c.get("databases");
      const user = c.get("user");
      const { workspaceId, projectId, type, identifier } = c.req.valid("json");

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
      }

      const project = await databases.getDocument<Project>(
        DATABASE_ID,
        PROJECTS_ID,
        projectId
      );

      if (!project) {
        return c.json({ error: "Project not found" }, 404);
      }

      // Get GitHub OAuth access token
      const githubToken = await getAccessToken(user.$id);

      if (!githubToken) {
        return c.json({
          error: "GitHub account not connected. Cannot generate summary."
        }, 400);
      }

      const octokit = new Octokit({
        auth: githubToken,
      });

      try {
        let summaryInput: SummaryInput;

        if (type === "pr") {
          // Fetch PR details
          const { data: pr } = await octokit.rest.pulls.get({
            owner: project.owner,
            repo: project.name,
            pull_number: Number(identifier),
          });

          // Fetch PR comments
          const { data: comments } = await octokit.rest.issues.listComments({
            owner: project.owner,
            repo: project.name,
            issue_number: Number(identifier),
          });

          summaryInput = {
            title: pr.title,
            description: pr.body || "",
            type: "pr",
            context: {
              repoName: `${project.owner}/${project.name}`,
              assignee: pr.assignee?.login,
              labels: pr.labels?.map((label: unknown) =>
                typeof label === 'string'
                  ? label
                  : typeof label === 'object' && label !== null && 'name' in label
                    ? (label as { name: string }).name
                    : ''
              ),
              comments: comments.slice(-5).map(comment => ({
                user: comment.user?.login || "unknown",
                body: comment.body || "",
                createdAt: comment.created_at,
              })),
            },
          };
        } else {
          // Fetch issue details
          const { data: issue } = await octokit.rest.issues.get({
            owner: project.owner,
            repo: project.name,
            issue_number: Number(identifier),
          });

          // Fetch issue comments
          const { data: comments } = await octokit.rest.issues.listComments({
            owner: project.owner,
            repo: project.name,
            issue_number: Number(identifier),
          });

          summaryInput = {
            title: issue.title,
            description: issue.body || "",
            type: "issue",
            context: {
              repoName: `${project.owner}/${project.name}`,
              assignee: issue.assignee?.login,
              labels: issue.labels?.map((label: unknown) =>
                typeof label === 'string'
                  ? label
                  : typeof label === 'object' && label !== null && 'name' in label
                    ? (label as { name: string }).name
                    : ''
              ),
              comments: comments.slice(-5).map(comment => ({
                user: comment.user?.login || "unknown",
                body: comment.body || "",
                createdAt: comment.created_at,
              })),
            },
          };
        }

        const summary = await generateAISummary(summaryInput);

        return c.json({
          data: summary,
        });
      } catch (error) {
        console.error(`Failed to generate AI summary for ${type}:`, error);
        return c.json({ error: `Failed to generate AI summary for ${type}` }, 500);
      }
    }
  );

export default app;
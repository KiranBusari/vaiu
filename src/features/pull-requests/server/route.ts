import { Hono } from "hono";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import { sessionMiddleware } from "@/lib/session-middleware";
import { getMember, isSuperAdmin } from "@/features/members/utilts";
import { DATABASE_ID, PROJECTS_ID, PR_ID } from "@/config";
import { Project } from "@/features/projects/types";
import { Octokit, RequestError } from "octokit";
import { PrStatus } from "../types";
import { createPrSchema } from "../schemas";
import { ID } from "node-appwrite";
import { AIReview } from "../types-ai";
import { AITestGeneration } from "../types-tests";
import { analyzeWithGemini, PRAnalysisInput, generateTestCases } from "@/lib/ai-service";

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
            $mergedAt: pr.merged_at,

            $collectionId: "",
            $databaseId: "",
            $permissions: [],
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

      // Check if user is a super admin
      const isSuper = await isSuperAdmin({ databases, userId: user.$id });

      if (!isSuper) {
        const member = await getMember({
          databases,
          workspaceId: project.workspaceId,
          userId: user.$id,
        });

        if (!member) {
          return c.json({ error: "Unauthorized" }, 401);
        }
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
        } catch (error) {
          if (error instanceof RequestError) {
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
          } else {
            console.error("Unexpected error:", error);
            return c.json({ error: "An unexpected error occurred." }, 500);
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
      } catch (error) {
        if (error instanceof RequestError) {
          console.error("Failed to create PR:", error);

          if (error.status === 422) {
            const response = error.response?.data as { errors?: { message?: string }[] };
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
        } else {
          console.error("Unexpected error:", error);
          return c.json({ error: "An unexpected error occurred." }, 500);
        }
      }
    }
  )
  .post(
    "/:projectId/ai-review/:prNumber",
    sessionMiddleware,
    async (c) => {
      const databases = c.get("databases");
      const user = c.get("user");
      const { projectId, prNumber } = c.req.param();

      try {
        const project = await databases.getDocument<Project>(
          DATABASE_ID,
          PROJECTS_ID,
          projectId
        );

        if (!project) {
          return c.json({ error: "Project not found" }, 404);
        }

        // Check if user is a super admin
        const isSuper = await isSuperAdmin({ databases, userId: user.$id });

        if (!isSuper) {
          const member = await getMember({
            databases,
            workspaceId: project.workspaceId,
            userId: user.$id,
          });

          if (!member) {
            return c.json({ error: "Unauthorized" }, 401);
          }
        }

        const octokit = new Octokit({
          auth: project.accessToken,
        });

        // Start AI review analysis
        const aiReview = await generateAIReview({
          projectId,
          prNumber: parseInt(prNumber),
          project,
          octokit,
        });

        return c.json({ success: true, review: aiReview });
      } catch (error) {
        console.error("AI Review failed:", error);
        return c.json({ error: "Failed to generate AI review" }, 500);
      }
    }
  )
  .post(
    "/:projectId/generate-tests/:prNumber",
    sessionMiddleware,
    async (c) => {
      const databases = c.get("databases");
      const user = c.get("user");
      const { projectId, prNumber } = c.req.param();

      try {
        const project = await databases.getDocument<Project>(
          DATABASE_ID,
          PROJECTS_ID,
          projectId
        );

        if (!project) {
          return c.json({ error: "Project not found" }, 404);
        }

        // Check if user is a super admin
        const isSuper = await isSuperAdmin({ databases, userId: user.$id });

        if (!isSuper) {
          const member = await getMember({
            databases,
            workspaceId: project.workspaceId,
            userId: user.$id,
          });

          if (!member) {
            return c.json({ error: "Unauthorized" }, 401);
          }
        }

        const octokit = new Octokit({
          auth: project.accessToken,
        });

        // Generate AI test cases
        const testGeneration = await generateAITests({
          projectId,
          prNumber: parseInt(prNumber),
          project,
          octokit,
        });

        return c.json({ success: true, tests: testGeneration });
      } catch (error) {
        console.error("Test generation failed:", error);
        return c.json({ error: "Failed to generate test cases" }, 500);
      }
    }
  );

async function generateAIReview({
  projectId,
  prNumber,
  project,
  octokit,
}: {
  projectId: string;
  prNumber: number;
  project: Project;
  octokit: Octokit;
}): Promise<AIReview> {
  try {
    // Fetch PR details
    const { data: pr } = await octokit.rest.pulls.get({
      owner: project.owner,
      repo: project.name,
      pull_number: prNumber,
    });

    // Fetch PR files and changes
    const { data: files } = await octokit.rest.pulls.listFiles({
      owner: project.owner,
      repo: project.name,
      pull_number: prNumber,
    });

    // Fetch PR reviews and comments for context
    const { data: reviews } = await octokit.rest.pulls.listReviews({
      owner: project.owner,
      repo: project.name,
      pull_number: prNumber,
    });

    // Get repository context
    const { data: repo } = await octokit.rest.repos.get({
      owner: project.owner,
      repo: project.name,
    });

    const analysisInput: PRAnalysisInput = {
      prTitle: pr.title,
      prDescription: pr.body || "No description provided",
      files: files.map(file => ({
        filename: file.filename,
        additions: file.additions,
        deletions: file.deletions,
        changes: file.changes,
        patch: file.patch,
        status: file.status
      })),
      prUrl: pr.html_url,
      repoName: `${project.owner}/${project.name}`,
      baseBranch: pr.base.ref,
      headBranch: pr.head.ref,
      existingReviews: reviews.map(review => ({
        user: review.user?.login || 'Unknown',
        state: review.state,
        body: review.body || '',
        submittedAt: review.submitted_at || new Date().toISOString()
      })),
      repoInfo: {
        language: repo.language,
        description: repo.description,
        topics: repo.topics || [],
        size: repo.size,
        defaultBranch: repo.default_branch
      }
    };

    const analysis = await analyzeWithGemini(analysisInput);

    const aiReview: AIReview = {
      id: ID.unique(),
      prNumber: pr.number,
      prTitle: pr.title,
      prUrl: pr.html_url,
      projectId,
      summary: analysis.summary,
      codeQuality: analysis.codeQuality,
      security: analysis.security,
      performance: analysis.performance,
      architecture: analysis.architecture,
      projectContext: analysis.projectContext,
      createdAt: new Date().toISOString(),
      analysisVersion: "1.0.0",
    };

    return aiReview;
  } catch (error) {
    console.error("Failed to generate AI review:", error);
    throw error;
  }
}

async function generateAITests({
  projectId,
  prNumber,
  project,
  octokit,
}: {
  projectId: string;
  prNumber: number;
  project: Project;
  octokit: Octokit;
}): Promise<AITestGeneration> {
  try {
    // Fetch PR details
    const { data: pr } = await octokit.rest.pulls.get({
      owner: project.owner,
      repo: project.name,
      pull_number: prNumber,
    });

    // Fetch PR files and changes
    const { data: files } = await octokit.rest.pulls.listFiles({
      owner: project.owner,
      repo: project.name,
      pull_number: prNumber,
    });

    // Fetch commit messages for context
    const { data: commits } = await octokit.rest.pulls.listCommits({
      owner: project.owner,
      repo: project.name,
      pull_number: prNumber,
    });

    // Get repository context
    const { data: repo } = await octokit.rest.repos.get({
      owner: project.owner,
      repo: project.name,
    });

    const testGenerationInput = {
      prTitle: pr.title,
      prDescription: pr.body || "No description provided",
      prUrl: pr.html_url,
      files: files.map(file => ({
        filename: file.filename,
        status: file.status as "added" | "modified" | "removed",
        additions: file.additions,
        deletions: file.deletions,
        patch: file.patch,
      })),
      commitMessages: commits.map(commit => commit.commit.message),
      author: pr.user?.login || "unknown",
      repoInfo: {
        language: repo.language,
        name: `${project.owner}/${project.name}`,
      },
    };

    const testGeneration = await generateTestCases(testGenerationInput);

    const aiTestGeneration: AITestGeneration = {
      id: ID.unique(),
      prNumber: pr.number,
      prTitle: pr.title,
      prUrl: pr.html_url,
      projectId,
      summary: testGeneration.summary,
      scenarios: testGeneration.scenarios,
      context: {
        filesChanged: files.map(file => ({
          filename: file.filename,
          status: file.status as "added" | "modified" | "removed",
          additions: file.additions,
          deletions: file.deletions,
        })),
        commitMessages: commits.map(commit => commit.commit.message),
        prDescription: pr.body || "No description provided",
        author: pr.user?.login || "unknown",
      },
      testingStrategy: testGeneration.testingStrategy,
      createdAt: new Date().toISOString(),
      generationVersion: "1.0.0",
    };

    return aiTestGeneration;
  } catch (error) {
    console.error("Failed to generate AI tests:", error);
    throw error;
  }
}


export default app;

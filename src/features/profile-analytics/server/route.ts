import { Hono } from "hono";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import { sessionMiddleware } from "@/lib/session-middleware";
import { Octokit } from "octokit";
import {
  GitHubUser,
  GitHubRepository,
  ProfileAnalytics,
  LanguageStats
} from "../types";

const app = new Hono()
  .get(
    "/:username",
    sessionMiddleware,
    zValidator("param", z.object({
      username: z.string().min(1),
    })),
    async (c) => {
      const { username } = c.req.valid("param");

      const octokit = new Octokit();

      try {
        const [userResponse, reposResponse] = await Promise.all([
          octokit.rest.users.getByUsername({ username }),
          octokit.rest.repos.listForUser({
            username,
            sort: "updated",
            per_page: 30,
          }),
        ]);

        const user = userResponse.data;
        const repositories = reposResponse.data;

        const languageStats = calculateLanguageStatsFromRepos(repositories);

        // Calculate top repositories
        const topRepositories = {
          mostStarred: repositories
            .sort((a, b) => (b.stargazers_count || 0) - (a.stargazers_count || 0))
            .slice(0, 5),
          mostForked: repositories
            .sort((a, b) => (b.forks_count || 0) - (a.forks_count || 0))
            .slice(0, 5),
          recentlyActive: repositories
            .sort((a, b) => new Date(b.pushed_at || b.updated_at || 0).getTime() - new Date(a.pushed_at || a.updated_at || 0).getTime())
            .slice(0, 5),
        };

        const collaborationStats = calculateBasicCollaborationStats(repositories);

        const analytics: ProfileAnalytics = {
          user: {
            login: user.login,
            name: user.name,
            avatar_url: user.avatar_url,
            bio: user.bio,
            public_repos: user.public_repos,
            followers: user.followers,
            following: user.following,
            created_at: user.created_at,
          } as GitHubUser,
          repositories: repositories as GitHubRepository[],
          languageStats,
          topRepositories: {
            mostStarred: topRepositories.mostStarred as GitHubRepository[],
            mostForked: topRepositories.mostForked as GitHubRepository[],
            recentlyActive: topRepositories.recentlyActive as GitHubRepository[],
          },
          collaborationStats,
          totalStars: repositories.reduce((sum, repo) => sum + (repo.stargazers_count || 0), 0),
          totalForks: repositories.reduce((sum, repo) => sum + (repo.forks_count || 0), 0),
        };

        return c.json({
          data: analytics,
        });
      } catch (error: any) {
        console.error("Failed to fetch profile analytics:", error);

        if (error.status === 404) {
          return c.json({ error: `GitHub user '${username}' not found` }, 404);
        }

        if (error.status === 403) {
          return c.json({
            error: "GitHub API rate limit exceeded. Please provide an access token for higher limits."
          }, 403);
        }

        return c.json({
          error: "Failed to fetch profile analytics",
          details: error.message
        }, 500);
      }
    }
  );

function calculateLanguageStatsFromRepos(repositories: any[]): LanguageStats {
  const languageStats: LanguageStats = {};

  repositories.forEach(repo => {
    if (repo.language) {
      if (!languageStats[repo.language]) {
        languageStats[repo.language] = { count: 0, bytes: 0, percentage: 0 };
      }
      languageStats[repo.language].count += 1;
    }
  });

  // Calculate percentages based on repository count
  const totalRepos = Object.values(languageStats).reduce((sum, lang) => sum + lang.count, 0);
  Object.keys(languageStats).forEach(language => {
    languageStats[language].percentage = (languageStats[language].count / totalRepos) * 100;
  });

  return languageStats;
}

function calculateBasicCollaborationStats(repositories: any[]): ProfileAnalytics['collaborationStats'] {
  const forksOfOthers = repositories.filter(repo => repo.fork).length;

  return {
    totalCollaborators: 0,
    organizationsCount: 0,
    forksOfOthers,
    contributedTo: forksOfOthers,
  };
}

export default app;
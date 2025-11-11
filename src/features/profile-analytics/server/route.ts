import { Hono } from "hono";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import { sessionMiddleware } from "@/lib/session-middleware";
import {
  getAccessToken,
  getUserByUsername,
  listUserRepositories,
} from "@/lib/github-api";
import {
  GitHubUser,
  GitHubRepository,
  ProfileAnalytics,
  LanguageStats
} from "../types";
import { DATABASE_ID, USER_PROFILES_ID } from "@/config";

const app = new Hono()
  .get(
    "/:username",
    sessionMiddleware,
    zValidator("param", z.object({
      username: z.string().min(1),
    })),
    async (c) => {
      const { username } = c.req.valid("param");
      const user = c.get("user");
      const databases = c.get("databases");

      // Additional validation to prevent undefined username
      if (!username || username === 'undefined' || username.trim() === '') {
        return c.json({ error: "Username is required" }, 400);
      }

      // Get GitHub access token - required for profile analytics
      const githubToken = await getAccessToken(user.$id);

      // Token is required to prevent users from accessing wrong profiles
      if (!githubToken) {
        return c.json({
          error: "GitHub account not connected. Please connect your GitHub account in Account settings to use analytics."
        }, 400);
      }

      // Fetch user's GitHub username from profile
      let targetUsername = username;

      try {
        const profile = await databases.getDocument(
          DATABASE_ID,
          USER_PROFILES_ID,
          user.$id
        );

        if (profile.githubUsername) {
          targetUsername = profile.githubUsername;
        }
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
        return c.json({
          error: "Failed to fetch user profile. Please ensure your GitHub account is connected."
        }, 500);
      }

      try {
        // These functions handle null tokens gracefully with unauthenticated requests
        const [githubUser, rawRepositories] = await Promise.all([
          getUserByUsername(githubToken, targetUsername),
          listUserRepositories(githubToken, targetUsername, {
            sort: "updated",
            per_page: 30,
          }),
        ]);

        // Map repositories to match GitHubRepository interface
        const repositories: GitHubRepository[] = rawRepositories.map(repo => ({
          name: repo.name,
          description: repo.description ?? undefined,
          html_url: repo.html_url,
          language: repo.language ?? undefined,
          stargazers_count: repo.stargazers_count || 0,
          forks_count: repo.forks_count || 0,
          fork: repo.fork || false,
          created_at: repo.created_at || new Date().toISOString(),
          pushed_at: repo.pushed_at || repo.created_at || new Date().toISOString(),
        }));

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
            .sort((a, b) => new Date(b.pushed_at).getTime() - new Date(a.pushed_at).getTime())
            .slice(0, 5),
        };

        const collaborationStats = calculateBasicCollaborationStats(repositories);

        const analytics: ProfileAnalytics = {
          user: {
            login: githubUser.login,
            name: githubUser.name,
            avatar_url: githubUser.avatar_url,
            bio: githubUser.bio,
            public_repos: githubUser.public_repos,
            followers: githubUser.followers,
            following: githubUser.following,
            created_at: githubUser.created_at,
          } as GitHubUser,
          repositories,
          languageStats,
          topRepositories,
          collaborationStats,
          totalStars: repositories.reduce((sum, repo) => sum + (repo.stargazers_count || 0), 0),
          totalForks: repositories.reduce((sum, repo) => sum + (repo.forks_count || 0), 0),
        };

        return c.json({
          data: analytics,
        });
      } catch (error: unknown) {
        console.error("Failed to fetch profile analytics:", error);

        if (typeof error === 'object' && error !== null && 'status' in error) {
          const httpError = error as { status: number };

          if (httpError.status === 404) {
            return c.json({ error: `GitHub user '${username}' not found` }, 404);
          }

          if (httpError.status === 403) {
            return c.json({
              error: "GitHub API rate limit exceeded. Please provide an access token for higher limits."
            }, 403);
          }
        }

        const errorMessage = typeof error === 'object' && error !== null && 'message' in error
          ? (error as { message: string }).message
          : 'Unknown error';

        return c.json({
          error: "Failed to fetch profile analytics",
          details: errorMessage
        }, 500);
      }
    }
  );

function calculateLanguageStatsFromRepos(repositories: GitHubRepository[]): LanguageStats {
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

function calculateBasicCollaborationStats(repositories: GitHubRepository[]): ProfileAnalytics['collaborationStats'] {
  const forksOfOthers = repositories.filter(repo => repo.fork).length;

  return {
    totalCollaborators: 0,
    organizationsCount: 0,
    forksOfOthers,
    contributedTo: forksOfOthers,
  };
}

export default app;
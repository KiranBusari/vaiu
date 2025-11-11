import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { sessionMiddleware } from "@/lib/session-middleware";
import { DATABASE_ID, USER_PROFILES_ID } from "@/config";
import { Octokit } from "octokit";

const app = new Hono()
  .get("/github-token", sessionMiddleware, async (c) => {
    try {
      const databases = c.get("databases");
      const user = c.get("user");

      const profile = await databases.getDocument(
        DATABASE_ID,
        USER_PROFILES_ID,
        user.$id
      );

      // Return masked token for security (only show last 4 characters)
      const token = profile.githubAccessToken;
      const hasToken = !!token && token.trim() !== "";
      const maskedToken = hasToken
        ? `${"*".repeat(Math.max(0, token.length - 4))}${token.slice(-4)}`
        : null;

      return c.json({
        data: {
          hasToken,
          maskedToken,
          connectedAt: profile.$updatedAt,
        },
      });
    } catch (error) {
      console.error("Error fetching GitHub token status:", error);
      return c.json({ error: "Failed to fetch GitHub token status" }, 500);
    }
  })
  .post(
    "/github-token",
    sessionMiddleware,
    zValidator(
      "json",
      z.object({
        token: z.string().min(1, "Token is required"),
      })
    ),
    async (c) => {
      try {
        const databases = c.get("databases");
        const user = c.get("user");
        const { token } = c.req.valid("json");

        // Validate the token by trying to fetch user info
        try {
          const octokit = new Octokit({ auth: token });
          await octokit.rest.users.getAuthenticated();
        } catch {
          return c.json(
            { error: "Invalid GitHub token. Please check and try again." },
            400
          );
        }

        // Check if profile exists
        try {
          await databases.getDocument(
            DATABASE_ID,
            USER_PROFILES_ID,
            user.$id
          );

          // Update existing profile
          await databases.updateDocument(
            DATABASE_ID,
            USER_PROFILES_ID,
            user.$id,
            {
              githubAccessToken: token,
            }
          );
        } catch (error: unknown) {
          const err = error as { code?: number };
          if (err.code === 404) {
            // Create new profile
            await databases.createDocument(
              DATABASE_ID,
              USER_PROFILES_ID,
              user.$id,
              {
                githubAccessToken: token,
                userId: user.$id,
              }
            );
          } else {
            throw error;
          }
        }

        return c.json({
          success: true,
          message: "GitHub token saved successfully",
        });
      } catch (error) {
        console.error("Error saving GitHub token:", error);
        return c.json({ error: "Failed to save GitHub token" }, 500);
      }
    }
  )
  .delete("/github-token", sessionMiddleware, async (c) => {
    try {
      const databases = c.get("databases");
      const user = c.get("user");

      await databases.updateDocument(
        DATABASE_ID,
        USER_PROFILES_ID,
        user.$id,
        {
          githubAccessToken: "",
        }
      );

      return c.json({
        success: true,
        message: "GitHub token removed successfully",
      });
    } catch (error) {
      console.error("Error removing GitHub token:", error);
      return c.json({ error: "Failed to remove GitHub token" }, 500);
    }
  });

export default app;

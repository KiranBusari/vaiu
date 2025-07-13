import { Hono } from "hono";
import { ID } from "node-appwrite";
import { zValidator } from "@hono/zod-validator";
import { deleteCookie, setCookie } from "hono/cookie";

import { createAdminClient, createSessionClient } from "@/lib/appwrite";
import { sessionMiddleware } from "@/lib/session-middleware";

import { AUTH_COOKIE } from "../constants";
import {
  forgotPasswordSchema,
  loginSchema,
  registerSchema,
  resetPasswordSchema,
  verifyUserSchema,
} from "../schemas";
import { headers } from "next/headers";

const app = new Hono()
  .get("/current", sessionMiddleware, async (c) => {
    const user = c.get("user");
    console.log(user);

    return c.json({ data: user });
  })
  .post("/login", zValidator("json", loginSchema), async (c) => {
    try {
      const { email, password } = c.req.valid("json");

      if (!email || !password) {
        return c.json({ error: "Email and password are required" }, 400);
      }

      if (password.trim().length < 6) {
        return c.json(
          { error: "Password must be at least 6 characters long" },
          400,
        );
      }

      if (!email.includes("@")) {
        return c.json({ error: "Invalid email address" }, 400);
      }

      const { account } = await createAdminClient();

      try {
        const session = await account.createEmailPasswordSession(
          email,
          password,
        );
        setCookie(c, AUTH_COOKIE, session.secret, {
          path: "/",
          httpOnly: true,
          secure: true,
          sameSite: "strict",
          maxAge: 60 * 60 * 24 * 30,
        });

        return c.json({ success: true });
      } catch (authError: unknown) {
        const error = authError as {
          code?: number;
          type?: string;
          message?: string;
        };
        if (error.code === 401) {
          return c.json({ error: "Invalid email or password" }, 401);
        }
        if (error.code === 404) {
          return c.json({ error: "User not found" }, 404);
        }
        if (error.code === 429) {
          return c.json(
            { error: "Too many login attempts. Please try again later" },
            429,
          );
        }
        if (error.type === "user_blocked") {
          return c.json({ error: "Account is temporarily blocked" }, 403);
        }
        if (error.type === "user_email_not_whitelisted") {
          return c.json({ error: "Email is not authorized" }, 403);
        }

        // Log the error for debugging while returning a generic message
        console.error("Login error:", error);
        return c.json({ error: error.message || "Authentication failed" }, 400);
      }
    } catch (error: unknown) {
      console.error("Unexpected login error:", error);
      return c.json(
        { error: "An unexpected error occurred during login" },
        500,
      );
    }
  })
  .post("/register", zValidator("json", registerSchema), async (c) => {
    try {
      const { name, email, password } = c.req.valid("json");
      console.log(name, email, password);
      if (!name || !email || !password) {
        return c.json({ error: "Name, email and password are required" }, 400);
      }
      if (password.trim().length < 6) {
        return c.json(
          { error: "Password must be at least 6 characters long" },
          400,
        );
      }
      if (!email.includes("@")) {
        return c.json({ error: "Invalid email address" }, 400);
      }
      const { users } = await createAdminClient();
      console.log("Admin account", users);

      try {
        // Check if user with this email already exists
        const existingUsers = await users.list([]);
        const userExists = existingUsers.users.some(
          (user) => user.email === email,
        );
        if (userExists) {
          return c.json({ error: "Email already registered" }, 400);
        }
      } catch (error: unknown) {
        console.log("Error checking users:", error);
        // Continue with registration if we can't check (better UX)
      }
      const { account } = await createAdminClient();
      console.log("Account", account);
      await account.create(ID.unique(), email, password, name);
      const session = await account.createEmailPasswordSession(email, password);

      setCookie(c, AUTH_COOKIE, session.secret, {
        path: "/",
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 60 * 60 * 24 * 30,
      });
      return c.json({ success: true });
    } catch (error) {
      return c.json({ error });
    }
  })
  .post("/verify", async (c) => {
    const { account } = await createSessionClient();
    const origin = headers().get("origin") ?? "";
    // console.log(origin);
    await account.createVerification(`${origin}/verify-user`);
    return c.json({ success: true });
  })
  .post("/verify-user", zValidator("json", verifyUserSchema), async (c) => {
    const { userId, secret } = c.req.valid("json");

    try {
      const { account } = await createSessionClient();
      await account.updateVerification(userId, secret);
      return c.json({
        success: true,
        message: "User verified successfully",
      });
    } catch (error: unknown) {
      console.error("Verification error:", error);

      // Type guard for error object
      const err = error as { code?: number; type?: string; message?: string };

      // Handle specific error cases
      if (err.code === 401) {
        return c.json(
          {
            success: false,
            message: "Invalid verification link or token expired",
          },
          401,
        );
      }

      if (err.code === 404) {
        return c.json(
          {
            success: false,
            message: "User not found",
          },
          404,
        );
      }

      // Default error response
      return c.json(
        {
          success: false,
          message: err.message || "Failed to verify user",
        },
        400,
      );
    }
  })
  .post("/logout", sessionMiddleware, async (c) => {
    const account = c.get("account");
    deleteCookie(c, AUTH_COOKIE);
    await account.deleteSession("current");
    return c.json({ success: true });
  })
  .post(
    "/forgot-password",
    zValidator("json", forgotPasswordSchema),
    async (c) => {
      const { email } = c.req.valid("json");
      const { account } = await createAdminClient();

      const origin = headers().get("origin") ?? "";

      await account.createRecovery(email, `${origin}/reset-password`);
      return c.json({ success: true });
    },
  )
  .post(
    "/update-password",
    zValidator("json", resetPasswordSchema),
    async (c) => {
      const { userId, secret, password } = c.req.valid("json");
      const { account } = await createAdminClient();

      try {
        await account.updateRecovery(userId, secret, password);
        return c.json({ success: true });
      } catch (error) {
        return c.json({ error });
      }
    },
  );
export default app;

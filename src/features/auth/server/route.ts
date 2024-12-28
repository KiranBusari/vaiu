import { Hono } from "hono";
import { ID } from "node-appwrite";
import { zValidator } from "@hono/zod-validator";
import { deleteCookie, setCookie } from "hono/cookie";

import { createAdminClient } from "@/lib/appwrite";
import { sessionMiddleware } from "@/lib/session-middleware";

import { AUTH_COOKIE } from "../constants";
import {
  forgotPasswordSchema,
  loginSchema,
  registerSchema,
  resetPasswordSchema,
} from "../schemas";
import { headers } from "next/headers";

const app = new Hono()
  .get("/current", sessionMiddleware, async (c) => {
    const user = c.get("user");
    return c.json({ data: user });
  })
  .post("/login", zValidator("json", loginSchema), async (c) => {
    try {
      const { email, password } = c.req.valid("json");

      const { account } = await createAdminClient();
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
  .post("/register", zValidator("json", registerSchema), async (c) => {
    try {
      const { name, email, password } = c.req.valid("json");
      console.log(name, email, password);

      const { account } = await createAdminClient();

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

      const origin = (await headers()).get("origin") ?? "";

      await account.createRecovery(email, `${origin}/reset-password`);
      return c.json({ success: true });
    }
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
    }
  );
export default app;

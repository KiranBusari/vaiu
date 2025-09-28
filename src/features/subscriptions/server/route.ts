import { Hono } from "hono";
import { getSubscription } from "@/features/subscriptions/queries";

const app = new Hono();

app.get("/current", async (c) => {
  try {
    const subscription = await getSubscription();
    return c.json({ data: subscription });
  } catch (error) {
    console.error("Error in /current route:", error);
    return c.json({ error: "Failed to get subscription" }, 500);
  }
});

export default app;

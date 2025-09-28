import { Query } from "node-appwrite";

import { DATABASE_ID, SUBSCRIPTIONS_ID } from "@/config";
import { createSessionClient } from "@/lib/appwrite";
import { plans } from "./plans";

export const getSubscription = async () => {
  try {
    const { account, databases } = await createSessionClient();
    const user = await account.get();

    const subscriptions = await databases.listDocuments(
      DATABASE_ID,
      SUBSCRIPTIONS_ID,
      [Query.equal("userId", user.$id)],
    );

    if (subscriptions.total > 0) {
      return subscriptions.documents[0];
    }

    // If no subscription, create a free one
    const freePlan = plans.Free;
    const now = new Date();
    const endDate = new Date();
    if (freePlan.durationInDays === Infinity) {
      endDate.setFullYear(now.getFullYear() + 100);
    } else {
      endDate.setDate(now.getDate() + freePlan.durationInDays);
    }

    const newSubscription = await databases.createDocument(
      DATABASE_ID,
      SUBSCRIPTIONS_ID,
      "unique()",
      {
        userId: user.$id,
        plan: freePlan.name,
        startDate: now.toISOString(),
        endDate: endDate.toISOString(),
        status: "active",
        workspaceLimit: freePlan.workspaceLimit,
        projectLimit: freePlan.projectLimit,
        roomLimit: 1, // Assuming 1 room for free plan
      },
    );

    return newSubscription;
  } catch (error) {
    console.error("Error in getSubscription:", error);
    throw error;
  }
};

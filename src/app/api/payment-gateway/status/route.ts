import crypto from "crypto";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";
import { Client, Databases, ID, Query } from "node-appwrite";
import { DATABASE_ID, SUBSCRIPTIONS_ID } from "@/config";
import { plans } from "@/features/subscriptions/plans";
import { getCurrent } from "@/features/auth/queries";

const saltKey = process.env.SALT_KEY;
const merchantId = process.env.MERCHANT_ID;

export async function POST(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const merchantTransactionId = searchParams.get("id");
    const user = await getCurrent();
    const userId = user?.$id;

    if (!userId) {
      throw new Error("User ID not found");
    }

    const keyIndex = 1;

    const string =
      `/pg/v1/status/${merchantId}/${merchantTransactionId}` + saltKey;
    const sha256 = crypto.createHash("sha256").update(string).digest("hex");
    const checksum = sha256 + "###" + keyIndex;

    const options = {
      method: "GET",
      url: `https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/status/${merchantId}/${merchantTransactionId}`,
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
        "X-VERIFY": checksum,
        "X-MERCHANT-ID": merchantId,
      },
    };

    const response = await axios(options);

    if (response.data.success === true) {
      const client = new Client()
        .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
        .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT!)
        .setKey(process.env.NEXT_APPWRITE_KEY!);

      const databases = new Databases(client);

      const planName = response.data.data.merchantTransactionId.split("-")[0];
      const plan = plans[planName as keyof typeof plans];

      const now = new Date();
      const endDate = new Date();
      if (plan.durationInDays === Infinity) {
        endDate.setFullYear(now.getFullYear() + 100);
      } else {
        endDate.setDate(now.getDate() + plan.durationInDays);
      }

      const subscriptions = await databases.listDocuments(
        DATABASE_ID,
        SUBSCRIPTIONS_ID,
        [Query.equal("userId", userId)]
      );

      // Convert Infinity to a large number for Appwrite compatibility
      const workspaceLimit = plan.workspaceLimit === Infinity ? 999999 : plan.workspaceLimit;
      const projectLimit = plan.projectLimit === Infinity ? 999999 : plan.projectLimit;
      const roomLimit = plan.roomLimit === Infinity ? 999999 : plan.roomLimit;

      if (subscriptions.total > 0) {
        await databases.updateDocument(
          DATABASE_ID,
          SUBSCRIPTIONS_ID,
          subscriptions.documents[0].$id,
          {
            plan: plan.name,
            startDate: now.toISOString(),
            endDate: endDate.toISOString(),
            status: "active",
            workspaceLimit: workspaceLimit,
            projectLimit: projectLimit,
            roomLimit: roomLimit,
          }
        );
      } else {
        await databases.createDocument(
          DATABASE_ID,
          SUBSCRIPTIONS_ID,
          ID.unique(),
          {
            userId: userId,
            plan: plan.name,
            startDate: now.toISOString(),
            endDate: endDate.toISOString(),
            status: "active",
            workspaceLimit: workspaceLimit,
            projectLimit: projectLimit,
            roomLimit: roomLimit,
          }
        );
      }

      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/success`, {
        status: 301,
      });
    } else {
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/failed`, {
        status: 301,
      });
    }
  } catch (error) {
    const err = error as Error;
    console.error(error);

    return NextResponse.json(
      { error: "Payment check failed", details: err.message },
      { status: 500 }
    );
  }
}
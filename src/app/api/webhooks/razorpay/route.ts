import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { Query } from "node-appwrite";
import { createAdminClient } from "@/lib/appwrite";
import { DATABASE_ID, SUBSCRIPTIONS_ID } from "@/config";
import { SubscriptionStatus } from "@/features/subscriptions/types";

export async function POST(req: NextRequest) {
    try {
        const body = await req.text();
        const signature = req.headers.get("x-razorpay-signature");

        if (!signature) {
            return NextResponse.json({ error: "Missing signature" }, { status: 400 });
        }

        // Verify webhook signature
        const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET!;
        const expectedSignature = crypto
            .createHmac("sha256", webhookSecret)
            .update(body)
            .digest("hex");

        if (expectedSignature !== signature) {
            return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
        }

        const event = JSON.parse(body);
        const { databases } = await createAdminClient();

        switch (event.event) {
            case "subscription.activated":
                await handleSubscriptionActivated(databases, event.payload.subscription.entity);
                break;

            case "subscription.charged":
                await handleSubscriptionCharged(databases, event.payload.subscription.entity);
                break;

            case "subscription.cancelled":
                await handleSubscriptionCancelled(databases, event.payload.subscription.entity);
                break;

            case "subscription.completed":
                await handleSubscriptionCompleted(databases, event.payload.subscription.entity);
                break;

            case "subscription.paused":
                await handleSubscriptionPaused(databases, event.payload.subscription.entity);
                break;

            case "subscription.resumed":
                await handleSubscriptionResumed(databases, event.payload.subscription.entity);
                break;

            default:
                console.log("Unhandled event type:", event.event);
        }

        return NextResponse.json({ received: true });
    } catch (error) {
        console.error("Error processing webhook:", error);
        return NextResponse.json(
            { error: "Webhook processing failed" },
            { status: 500 }
        );
    }
}

async function handleSubscriptionActivated(databases: any, razorpaySubscription: any) {
    try {
        const subscriptions = await databases.listDocuments(
            DATABASE_ID,
            SUBSCRIPTIONS_ID,
            [
                Query.equal("razorpaySubscriptionId", razorpaySubscription.id),
                Query.limit(1),
            ]
        );

        if (subscriptions.documents.length > 0) {
            const subscription = subscriptions.documents[0];

            const startDate = new Date(razorpaySubscription.start_at * 1000);
            const endDate = new Date(razorpaySubscription.end_at * 1000);

            await databases.updateDocument(
                DATABASE_ID,
                SUBSCRIPTIONS_ID,
                subscription.$id,
                {
                    status: SubscriptionStatus.ACTIVE,
                    currentPeriodStart: startDate.toISOString(),
                    currentPeriodEnd: endDate.toISOString(),
                }
            );
        }
    } catch (error) {
        console.error("Error handling subscription activation:", error);
    }
}

async function handleSubscriptionCharged(databases: any, razorpaySubscription: any) {
    try {
        const subscriptions = await databases.listDocuments(
            DATABASE_ID,
            SUBSCRIPTIONS_ID,
            [
                Query.equal("razorpaySubscriptionId", razorpaySubscription.id),
                Query.limit(1),
            ]
        );

        if (subscriptions.documents.length > 0) {
            const subscription = subscriptions.documents[0];

            const endDate = new Date(razorpaySubscription.current_end * 1000);

            await databases.updateDocument(
                DATABASE_ID,
                SUBSCRIPTIONS_ID,
                subscription.$id,
                {
                    currentPeriodEnd: endDate.toISOString(),
                }
            );
        }
    } catch (error) {
        console.error("Error handling subscription charged:", error);
    }
}

async function handleSubscriptionCancelled(databases: any, razorpaySubscription: any) {
    try {
        const subscriptions = await databases.listDocuments(
            DATABASE_ID,
            SUBSCRIPTIONS_ID,
            [
                Query.equal("razorpaySubscriptionId", razorpaySubscription.id),
                Query.limit(1),
            ]
        );

        if (subscriptions.documents.length > 0) {
            const subscription = subscriptions.documents[0];

            await databases.updateDocument(
                DATABASE_ID,
                SUBSCRIPTIONS_ID,
                subscription.$id,
                {
                    status: SubscriptionStatus.CANCELLED,
                }
            );
        }
    } catch (error) {
        console.error("Error handling subscription cancellation:", error);
    }
}

async function handleSubscriptionCompleted(databases: any, razorpaySubscription: any) {
    try {
        const subscriptions = await databases.listDocuments(
            DATABASE_ID,
            SUBSCRIPTIONS_ID,
            [
                Query.equal("razorpaySubscriptionId", razorpaySubscription.id),
                Query.limit(1),
            ]
        );

        if (subscriptions.documents.length > 0) {
            const subscription = subscriptions.documents[0];

            await databases.updateDocument(
                DATABASE_ID,
                SUBSCRIPTIONS_ID,
                subscription.$id,
                {
                    status: SubscriptionStatus.EXPIRED,
                }
            );
        }
    } catch (error) {
        console.error("Error handling subscription completion:", error);
    }
}

async function handleSubscriptionPaused(databases: any, razorpaySubscription: any) {
    try {
        const subscriptions = await databases.listDocuments(
            DATABASE_ID,
            SUBSCRIPTIONS_ID,
            [
                Query.equal("razorpaySubscriptionId", razorpaySubscription.id),
                Query.limit(1),
            ]
        );

        if (subscriptions.documents.length > 0) {
            const subscription = subscriptions.documents[0];

            await databases.updateDocument(
                DATABASE_ID,
                SUBSCRIPTIONS_ID,
                subscription.$id,
                {
                    status: SubscriptionStatus.CANCELLED,
                }
            );
        }
    } catch (error) {
        console.error("Error handling subscription pause:", error);
    }
}

async function handleSubscriptionResumed(databases: any, razorpaySubscription: any) {
    try {
        const subscriptions = await databases.listDocuments(
            DATABASE_ID,
            SUBSCRIPTIONS_ID,
            [
                Query.equal("razorpaySubscriptionId", razorpaySubscription.id),
                Query.limit(1),
            ]
        );

        if (subscriptions.documents.length > 0) {
            const subscription = subscriptions.documents[0];

            await databases.updateDocument(
                DATABASE_ID,
                SUBSCRIPTIONS_ID,
                subscription.$id,
                {
                    status: SubscriptionStatus.ACTIVE,
                }
            );
        }
    } catch (error) {
        console.error("Error handling subscription resume:", error);
    }
}

"use client";

import { useGetSubscription } from "@/features/subscriptions/api/use-get-subscription";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";

const SubscriptionPage = () => {
  const router = useRouter();
  const { data: subscription, isLoading } = useGetSubscription();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">My Subscription</h1>
      {subscription ? (
        <Card>
          <CardHeader>
            <CardTitle>Current Plan: {subscription.plan}</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Status: {subscription.status}</p>
            <p>Workspace Limit: {subscription.workspaceLimit}</p>
            <p>Project Limit: {subscription.projectLimit}</p>
            <p>Room Limit: {subscription.roomLimit}</p>
            <p>End Date: {new Date(subscription.endDate).toLocaleDateString()}</p>
            <Button onClick={() => router.push("/pricing")} className="mt-4">
              Upgrade Plan
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent>
            <p>Subscription information is currently unavailable.</p>
            <Button onClick={() => router.push("/pricing")} className="mt-4">
              View Plans
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SubscriptionPage;
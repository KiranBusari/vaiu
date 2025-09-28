"use client";

import { plans } from "@/features/subscriptions/plans";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useCreateSubscription } from "@/features/subscriptions/api/use-create-subscription";
import { Plan } from "@/features/subscriptions/types";

const SubscriptionClient = () => {
  const createSubscription = useCreateSubscription();

  const handleSubscribe = (plan: Plan) => {
    createSubscription.mutate(plan, {
      onSuccess: (data) => {
        window.location.href = data.data.instrumentResponse.redirectInfo.url;
      },
    });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <h1 className="text-4xl font-bold mb-8">Pricing</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {Object.values(plans).map((plan) => (
          <Card key={plan.name}>
            <CardHeader>
              <CardTitle>{plan.name}</CardTitle>
              <CardDescription>
                {plan.workspaceLimit} Workspaces, {plan.projectLimit} Projects
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold">$ {plan.name === "Free" ? 0 : (plan.name === "Pro" ? 10 : 50)}</p>
              <p className="text-gray-500">per month</p>
            </CardContent>
            <CardFooter>
              <Button
                onClick={() => handleSubscribe(plan.name as Plan)}
                disabled={plan.name === "Free" || createSubscription.isPending}
              >
                {plan.name === "Free"
                  ? "Current Plan"
                  : createSubscription.isPending
                  ? "Redirecting..."
                  : "Subscribe"}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SubscriptionClient;
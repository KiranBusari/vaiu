"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useVerify } from "../api/use-verify";

export const VerifyUserCard = () => {
  const { mutate: verify, isPending, error } = useVerify();

  const onSubmit = () => {
    verify();
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Verify Your Account</CardTitle>
        <CardDescription>Click below to verify your account</CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <p className="mb-4 text-red-500">
            {error instanceof Error
              ? error.message
              : "Failed to verify account"}
          </p>
        )}
        <Button onClick={onSubmit} disabled={isPending} className="w-full">
          {isPending ? "Verifying..." : "Verify Account"}
        </Button>
      </CardContent>
    </Card>
  );
};

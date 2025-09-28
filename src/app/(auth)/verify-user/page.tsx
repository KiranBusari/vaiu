"use client";

import React, { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useVerifyUser } from "@/features/auth/api/use-verify-user";

const VerifyUserPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { mutate: verifyUser, isPending, isSuccess, error } = useVerifyUser();

  useEffect(() => {
    const userId = searchParams.get("userId");
    const secret = searchParams.get("secret");

    if (!userId || !secret) {
      toast.error(
        "Invalid verification link. Please check your email and try again.",
      );
      setTimeout(() => {
        router.push("/sign-in");
      }, 2000);
      return;
    }

    // Call the verification mutation
    verifyUser({ json: { userId, secret } });
  }, [searchParams, router, verifyUser]);

  return (
    <Card className="w-full max-w-md p-6">
      <CardHeader>
        <CardTitle>Email Verification</CardTitle>
        <CardDescription>
          {isPending
            ? "Verifying your email..."
            : isSuccess
              ? "Email verified successfully!"
              : "Verification status"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isPending && (
          <div className="text-center">
            Please wait while we verify your email...
          </div>
        )}
        {error && (
          <div className="text-center text-red-500">
            {error instanceof Error ? error.message : "Verification failed"}
          </div>
        )}
        {isSuccess && (
          <div className="text-center text-green-500">
            Your email has been verified successfully! Redirecting...
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default VerifyUserPage;

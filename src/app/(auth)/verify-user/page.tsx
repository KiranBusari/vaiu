"use client";

import React, { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
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
      return;
    }

    verifyUser(
      { json: { userId, secret } },
      {
        onSuccess: () => {
          setTimeout(() => {
            router.push("/sign-in");
          }, 2000);
        },
      },
    );
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
            Your email has been verified successfully! Redirecting to login...
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default VerifyUserPage;

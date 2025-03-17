"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const VerifyUserPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const userId = searchParams.get("userId");
    const secret = searchParams.get("secret");

    if (!userId || !secret) {
      setError("Invalid verification link");
      setIsLoading(false);
      return;
    }

    const verifyUser = async () => {
      try {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_APP_URL}/api/v1/auth/verify-user`,
          { userId, secret },
        );

        if (response.data.success) {
          setSuccess(true);
          setTimeout(() => {
            router.push("/sign-in");
          }, 2000);
        } else {
          throw new Error(response.data.message || "Verification failed");
        }
      } catch (err: unknown) {
        if (axios.isAxiosError(err) && err.response?.data?.message) {
          setError(err.response.data.message);
        } else {
          setError(
            "Failed to verify user. Please try again or contact support.",
          );
        }
      } finally {
        setIsLoading(false);
      }
    };

    verifyUser();
  }, [searchParams, router]);

  return (
    <Card className="w-full max-w-md p-6">
      <CardHeader>
        <CardTitle>Email Verification</CardTitle>
        <CardDescription>
          {isLoading
            ? "Verifying your email..."
            : success
              ? "Email verified successfully!"
              : "Verification status"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading && (
          <div className="text-center">
            Please wait while we verify your email...
          </div>
        )}
        {error && <div className="text-center text-red-500">{error}</div>}
        {success && (
          <div className="text-center text-green-500">
            Your email has been verified successfully! Redirecting to login...
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default VerifyUserPage;

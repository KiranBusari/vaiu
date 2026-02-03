"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { CheckCircle, AlertCircle, Loader2 } from "lucide-react";

import { client } from "@/lib/rpc";

const VerifyMagicLinkPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const userId = searchParams.get("userId");
  const secret = searchParams.get("secret");

  const {
    data,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["verifyMagicLink", userId, secret],
    queryFn: async () => {
      if (!userId || !secret) {
        throw new Error("Missing userId or secret");
      }
      const response = await client.api.v1.auth["verify-magic-link"].$post({
        json: { userId, secret },
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(('error' in errorData ? errorData.error : null) || "Failed to verify magic link");
      }
      return response.json();
    },
    enabled: !!userId && !!secret,
  });

  useEffect(() => {
    if (data?.success) {
      router.push("/");
    }
  }, [data, router]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Icon Container */}
        <div className="flex justify-center">
          {isLoading && (
            <div className="rounded-full bg-primary/10 p-4">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
          )}
          {isError && (
            <div className="rounded-full bg-destructive/10 p-4">
              <AlertCircle className="h-12 w-12 text-destructive" />
            </div>
          )}
          {data?.success && (
            <div className="rounded-full bg-green-100 p-4">
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="space-y-4 text-center">
          {isLoading && (
            <>
              <h1 className="text-3xl font-bold tracking-tight">Verifying your magic link</h1>
              <p className="text-base text-muted-foreground">
                Please wait while we verify your sign-in link...
              </p>
            </>
          )}
          {isError && (
            <>
              <h1 className="text-3xl font-bold tracking-tight">Verification failed</h1>
              <p className="text-base text-muted-foreground">
                {error?.message || "An unknown error occurred. Please try signing in again."}
              </p>
            </>
          )}
          {data?.success && (
            <>
              <h1 className="text-3xl font-bold tracking-tight">Verified successfully</h1>
              <p className="text-base text-muted-foreground">
                Your email has been verified. Redirecting to dashboard...
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerifyMagicLinkPage;

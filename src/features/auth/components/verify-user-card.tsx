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
import { useResendVerification } from "../api/use-resend-verification";

export const VerifyUserCard = () => {
  const { mutate: verify, isPending, error } = useVerify();
  const { mutate: resendVerification, isPending: isResending } =
    useResendVerification();

  const onSubmit = () => {
    verify();
  };

  const onResend = () => {
    resendVerification();
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Verify Your Account</CardTitle>
        <CardDescription>
          Please check your email for a verification link, or send a new
          verification email
        </CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <p className="mb-4 text-red-500">
            {error instanceof Error
              ? error.message
              : "Failed to verify account"}
          </p>
        )}
        <div className="space-y-3">
          <Button onClick={onSubmit} disabled={isPending} className="w-full">
            {isPending ? "Verifying..." : "Verify Account"}
          </Button>
          <Button
            onClick={onResend}
            disabled={isResending || isPending}
            variant="outline"
            className="w-full"
          >
            {isResending ? "Sending..." : "Resend Verification Email"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

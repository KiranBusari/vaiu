"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import axios from "axios";
import { useRouter } from "next/navigation";

export const VerifyUserCard = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const onSubmit = async () => {
    try {
      setIsLoading(true);
      setError(null);
      await axios.post(`${process.env.NEXT_PUBLIC_APP_URL}/api/v1/auth/verify`);
      // router.push("/k");
    } catch (err) {
      setError("Failed to verify. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Verify Your Account</CardTitle>
        <CardDescription>Click below to verify your account</CardDescription>
      </CardHeader>
      <CardContent>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <Button onClick={onSubmit} disabled={isLoading} className="w-full">
          {isLoading ? "Verifying..." : "Verify Account"}
        </Button>
      </CardContent>
    </Card>
  );
};

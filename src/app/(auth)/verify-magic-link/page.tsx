"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

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
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
        <h1 className="mb-4 text-center text-2xl font-bold text-black">
          Verifying your magic link...
        </h1>
        {isLoading && (
          <p className="text-center text-gray-600">Please wait...</p>
        )}
        {isError && (
          <p className="text-center text-red-500">
            Error: {error?.message || "An unknown error occurred."}
          </p>
        )}
        {data?.success && (
          <p className="text-center text-green-500">
            Successfully verified! Redirecting...
          </p>
        )}
      </div>
    </div>
  );
};

export default VerifyMagicLinkPage;

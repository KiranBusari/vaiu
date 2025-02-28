"use client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DottedSeparator } from "@/components/dotted-separator";

export const VerificationMailSentCard = () => {
  return (
    <Card className="size-full md:w-[487px] border-none shadow-none dark:bg-zinc-800 bg-slate-200">
      <CardHeader className="flex flex-col items-center text-center p-7">
        <CardTitle className="text-2xl">Verification Mail Sent</CardTitle>
        <CardDescription>
          We have sent a verification link to your email address. Please check your inbox and follow the instructions to verify your account.
        </CardDescription>
      </CardHeader>
      <div className="px-7">
        <DottedSeparator />
      </div>
      <CardContent className="p-7">
        back to Sign In
      </CardContent>
    </Card>
  );
};
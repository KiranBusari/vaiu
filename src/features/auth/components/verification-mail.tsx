"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DottedSeparator } from "@/components/dotted-separator";

export const VerificationMailSentCard = () => {
  return (
    <Card className="size-full border-none bg-slate-200 shadow-none dark:bg-zinc-800 md:w-[487px]">
      <CardHeader className="flex flex-col items-center p-7 text-center">
        <CardTitle className="text-2xl">Verification Mail Sent</CardTitle>
        <CardDescription>
          We have sent a verification link to your email address. Please check
          your inbox and follow the instructions to verify your account.
        </CardDescription>
      </CardHeader>
      <div className="px-7">
        <DottedSeparator />
      </div>
      <CardContent className="p-7">back to Sign In</CardContent>
    </Card>
  );
};

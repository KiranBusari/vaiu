"use client";

import { Mail, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const CheckEmailPage = () => {
  return (
    <div className="flex h-auto flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Icon Container */}
        <div className="flex justify-center">
          <div className="rounded-full bg-primary/10 p-4">
            <Mail className="h-12 w-12 text-primary" />
          </div>
        </div>

        {/* Content Card */}
        <div className="space-y-4 text-center">
          <h1 className="text-3xl font-bold tracking-tight">Check your email</h1>
          <p className="text-base text-muted-foreground">
            We&apos;ve sent a magic link to your email address. Click the link to
            complete your sign in.
          </p>
        </div>

        {/* Action */}
        <div className="space-y-6 pt-4">
          <p className="text-xs text-muted-foreground">
            Didn&apos;t receive an email?{" "}
            <Link href="/sign-up" className="font-semibold text-primary hover:underline">
              Try again
            </Link>
          </p>
          <div>
            <Link href="/sign-in">
              <Button variant="outline" className="w-full">
                Back to sign in
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckEmailPage;

"use client";

import { GithubTokenSettings } from "@/features/profile/components/github-token-settings";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export const UserSettingsClient = () => {
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  return (
    <div className="w-full lg:max-w-4xl">
      <div className="flex flex-col gap-y-4">
        <Button
          variant="ghost"
          onClick={handleBack}
          className="w-fit flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 px-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <div className="space-y-1">
          <h3 className="text-2xl font-semibold">Account Settings</h3>
          <p className="text-sm text-muted-foreground">
            Manage your account settings and integrations
          </p>
        </div>
        <Separator />
        <GithubTokenSettings />
      </div>
    </div>
  );
};

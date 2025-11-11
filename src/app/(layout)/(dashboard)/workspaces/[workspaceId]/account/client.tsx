"use client";

import { GithubTokenSettings } from "@/features/profile/components/github-token-settings";
import { Separator } from "@/components/ui/separator";

export const UserSettingsClient = () => {
  return (
    <div className="w-full lg:max-w-4xl">
      <div className="flex flex-col gap-y-4">
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

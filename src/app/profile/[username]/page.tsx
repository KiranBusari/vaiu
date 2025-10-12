"use client";

import { ProfileAnalyticsDashboard } from "@/features/profile-analytics/components/profile-analytics-dashboard";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

interface ProfileAnalyticsProps {
  params: { username: string }
}

export default function ProfileAnalytics({
  params
}: ProfileAnalyticsProps) {
  const router = useRouter();
  // Add validation to ensure username is not undefined
  if (!params.username) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Username Required
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Please provide a valid GitHub username to view analytics.
          </p>
        </div>
      </div>
    );
  }

  const handleBack = () => {
    // Go back to the previous page or to workspaces if no history
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push('/');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
        <Button
          variant="ghost"
          onClick={handleBack}
          className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Workspace
        </Button>
      </div>

      <ProfileAnalyticsDashboard
        username={params.username}
      />
    </div>
  );
}
import { ProfileAnalyticsDashboard } from "@/features/profile-analytics/components/profile-analytics-dashboard";

export default function ProfileAnalytics({ 
  params 
}: { 
  params: { username: string } 
}) {
  return (
    <ProfileAnalyticsDashboard 
      username={params.username}
    />
  );
}
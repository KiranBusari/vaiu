// import { client } from "@/lib/rpc"; // Temporarily disabled
import { useQuery } from "@tanstack/react-query";

type Subscription = {
  plan: string;
  status: string;
  workspaceLimit: number;
  projectLimit: number;
  roomLimit: number;
  endDate: string;
} | null;

export const useGetSubscription = () => {
  const query = useQuery<Subscription>({
    queryKey: ["subscriptions"],
    queryFn: async (): Promise<Subscription> => {
      // TODO: Fix subscriptions API endpoint - TypeScript cannot find subscriptions route
      // const response = await client.api.v1.subscriptions.current.$get();
      // if (!response.ok) {
      //   const errorData = await response.json().catch(() => ({}));
      //   throw new Error(
      //     "error" in errorData && typeof errorData.error === "string"
      //       ? errorData.error
      //       : "Failed to get subscriptions",
      //   );
      // }
      // const { data } = await response.json();
      // return data;
      
      // Temporary fallback until API endpoint is fixed
      return null;
    },
  });

  return query;
};

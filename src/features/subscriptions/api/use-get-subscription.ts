import { client } from "@/lib/rpc";
import { useQuery } from "@tanstack/react-query";

export const useGetSubscription = () => {
  const query = useQuery({
    queryKey: ["subscription"],
    queryFn: async () => {
      const response = await client.api.v1.subscriptions.current.$get();
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          "error" in errorData && typeof errorData.error === "string"
            ? errorData.error
            : "Failed to get subscription"
        );
      }
      const { data } = await response.json();
      return data;
    },
  });

  return query;
};
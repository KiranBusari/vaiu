import { client } from "@/lib/rpc";
import { useQuery } from "@tanstack/react-query";

export const useGetNotifications = () => {
  const query = useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      const response = await client.api.v1.notifications.$get();
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          "error" in errorData ? String(errorData.error) : "Failed to fetch notifications",
        );
      }
      const { data } = await response.json();
      return data;
    },
  });

  return query;
};

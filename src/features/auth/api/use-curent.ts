import { client } from "@/lib/rpc";
import { useQuery } from "@tanstack/react-query";

export const useCurrent = () => {
  const query = useQuery({
    queryKey: ["current"],
    queryFn: async () => {
      const response = await client.api.v1.auth.current.$get();
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          "error" in errorData && typeof errorData.error === "string"
            ? errorData.error
            : "Failed to fetch current user",
        );
      }
      const { data } = await response.json();
      return data;
    },
  });

  return query;
};

import { client } from "@/lib/rpc";
import { useQuery } from "@tanstack/react-query";

export const useCurrent = () => {
  const query = useQuery({
    queryKey: ["current"],
    queryFn: async () => {
      const response = await client.api.v1.auth.current.$get();
      console.log("Response", response);

      if (!response.ok) {
        return null;
      }
      const { data } = await response.json();
      return data;
    },
  });

  return query;
};

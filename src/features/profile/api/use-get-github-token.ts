import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/rpc";

export const useGetGithubToken = () => {
  const query = useQuery({
    queryKey: ["github-token"],
    queryFn: async () => {
      const response = await client.api.v1.profile["github-token"].$get();

      if (!response.ok) {
        throw new Error("Failed to fetch GitHub token");
      }

      const { data } = await response.json();

      return data;
    },
  });

  return query;
};

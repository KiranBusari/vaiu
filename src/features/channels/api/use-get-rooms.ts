import { client } from "@/lib/rpc";
import { useQuery } from "@tanstack/react-query";

interface useGetRoomsProps {
  workspaceId: string;
  projectId: string;
}
export const useGetRooms = ({ workspaceId, projectId }: useGetRoomsProps) => {
  const query = useQuery({
    queryKey: ["rooms", { workspaceId, projectId }],
    queryFn: async () => {
      const response = await client.api.v1.rooms.$get({
        query: { workspaceId, projectId },
      });
      if (!response.ok) {
        throw new Error("Failed to get rooms");
      }
      const { data } = await response.json();
      return data;
    },
  });

  return query;
};

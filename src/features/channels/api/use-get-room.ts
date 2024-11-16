import { client } from "@/lib/rpc";
import { useQuery } from "@tanstack/react-query";

interface useGetRoomProps {
  roomId: string;
}
export const useGetRoom = ({ roomId }: useGetRoomProps) => {
  const query = useQuery({
    queryKey: ["room", roomId],
    queryFn: async () => {
      const response = await client.api.rooms[":roomId"].$get({
        param: { roomId },
      });
      if (!response.ok) {
        throw new Error("Failed to get room");
      }
      const { data } = await response.json();
      return data;
    },
  });

  return query;
};

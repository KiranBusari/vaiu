import { client } from "@/lib/rpc";
import { useQuery } from "@tanstack/react-query";

interface useGetRoomProps {
  roomId: string;
}
export const useGetRoom = ({ roomId }: useGetRoomProps) => {
  const query = useQuery({
    queryKey: ["room", roomId],
    queryFn: async () => {
      const response = await client.api.v1.rooms[":roomId"].$get({
        param: { roomId },
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          "error" in errorData ? errorData.error : "Failed to fetch room",
        );
      }
      const { data } = await response.json();

      return data;
    },
  });

  return query;
};

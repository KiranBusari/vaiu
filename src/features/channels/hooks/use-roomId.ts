import { useParams } from "next/navigation";

export const useRoomId = () => {
  const params = useParams();
  return params.roomId as string;
};

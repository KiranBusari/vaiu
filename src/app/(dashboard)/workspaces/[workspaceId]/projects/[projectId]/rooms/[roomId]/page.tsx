import { redirect } from "next/navigation";

import { getCurrent } from "@/features/auth/queries";

import { RoomId } from "./client";

interface RoomIdProps {
  params: {
    workspaceId: string;
    projectId: string;
    roomId: string;
  };
}

const RoomIdPage = async () => {
  const current = await getCurrent();
  if (!current) redirect("/sign-in");

  return <RoomId />;
};

export default RoomIdPage;

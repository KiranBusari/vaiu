import { redirect } from "next/navigation";
import { getCurrent } from "@/features/auth/queries";
import { UserSettingsClient } from "./client";

const UserSettingsPage = async () => {
  const user = await getCurrent();
  if (!user) redirect("/sign-in");

  return <UserSettingsClient />;
};

export default UserSettingsPage;

import { getCurrent } from "@/features/auth/queries";
import { redirect } from "next/navigation";
import SubscriptionClient from "./SubscriptionClient";

const SubscriptionPage = async () => {
  const current = await getCurrent();
  if (!current) redirect("/sign-in");
  return <SubscriptionClient />;
};

export default SubscriptionPage;

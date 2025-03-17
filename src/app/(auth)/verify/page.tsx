import { VerifyUserCard } from "@/features/auth/components/verify-user-card";
import { getCurrent } from "@/features/auth/queries";

const page = async () => {
  const user = await getCurrent();
  // console.log(user);
  if (!user?.emailVerification) return <VerifyUserCard />;
};
export default page;

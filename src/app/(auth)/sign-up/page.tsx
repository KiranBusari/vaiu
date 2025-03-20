import { redirect } from "next/navigation";

import { SignUpCard } from "@/features/auth/components/sign-up-card";
import { getCurrent } from "@/features/auth/queries";
import { getWorkspaces } from "@/features/workspaces/queries";
import { VerifyUserCard } from "@/features/auth/components/verify-user-card";

const SignUp = async () => {
  const user = await getCurrent();
  if (!user) return <SignUpCard />;
  if (!user.emailVerification) return <VerifyUserCard />;
  else {
    const workspaces = await getWorkspaces();
    if (workspaces.total === 0 && user) {
      redirect("/workspaces/create");
    } else {
      redirect(`/workspaces/${workspaces.documents[0].$id}`);
    }
  }
};

export default SignUp;

import { redirect } from "next/navigation";

import { SignUpCard } from "@/features/auth/components/sign-up-card";
import { getCurrent } from "@/features/auth/queries";
import { getWorkspaces } from "@/features/workspaces/queries";

const SignUp = async () => {
  const user = await getCurrent();
  const workspaces = await getWorkspaces();
  if (!user) return <SignUpCard />;
  if (workspaces.total === 0 && user) {
    redirect("/workspaces/create");
  } else {
    redirect(`/workspaces/${workspaces.documents[0].$id}`);
  }
};
export default SignUp;

import { redirect } from "next/navigation";

import { SignInCard } from "@/features/auth/components/sign-in-card";
import { getWorkspaces } from "@/features/workspaces/queries";
import { getCurrent } from "@/features/auth/queries";

const SignIn = async () => {
  const user = await getCurrent();
  console.log("User", user);

  if (!user) return <SignInCard />;
  else {
    const workspaces = await getWorkspaces();
    if (workspaces.total === 0 && user) {
      redirect("/workspaces/create");
    } else {
      redirect(`/workspaces/${workspaces.documents[0].$id}`);
    }
  }
};

export default SignIn;

import { SignInCard } from "@/features/auth/components/sign-in-card";
import { getCurrent } from "@/features/auth/queries";
import { getWorkspaces } from "@/features/workspaces/queries";
import { redirect } from "next/navigation";

const SignIn = async () => {
  const user = await getCurrent();
  console.log("User", user);
  if (!user || !user.emailVerification || !user.phoneVerification)
    return <SignInCard />;
  else {
    const workspaces = await getWorkspaces();
    console.log(workspaces);

    if (workspaces.total === 0 && user) {
      redirect("/workspaces/create");
    } else {
      redirect(`/workspaces/${workspaces?.documents[0]?.$id}`);
    }
  }
};

export default SignIn;

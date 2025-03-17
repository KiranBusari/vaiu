import { SignInCard } from "@/features/auth/components/sign-in-card";
import { getCurrent } from "@/features/auth/queries";

const SignIn = async () => {
  const user = await getCurrent();
  console.log("User", user);
  if (!user || !user.emailVerification) return <SignInCard />;
};

export default SignIn;

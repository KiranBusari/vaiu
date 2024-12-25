import { type Metadata } from "next";
import { ResetPasswordCard } from "@/features/auth/components/reset-password-card";

export const metadata: Metadata = {
  title: "Reset Password",
  description: "Reset your password",
};

export default function ResetPasswordPage() {
  return <ResetPasswordCard />;
}

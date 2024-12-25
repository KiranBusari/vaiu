import { type Metadata } from "next";
import { ForgotPasswordCard } from "@/features/auth/components/forgot-password-card";

export const metadata: Metadata = {
  title: "Forgot Password",
  description: "Reset your password by entering your email address",
};

export default function ForgotPasswordPage() {
  return <ForgotPasswordCard />;
}

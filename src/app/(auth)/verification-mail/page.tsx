import { type Metadata } from "next";
import { VerificationMailSentCard } from "@/features/auth/components/verification-mail";

export const metadata: Metadata = {
  title: "Verification Mail Sent",
  description: "We have sent a verification link to your email address. Please check your inbox and follow the instructions to verify your account.",
};

export default function VerificationMail() {
  return <VerificationMailSentCard />;
}

import type { Metadata } from "next";
import { Suspense } from "react";
import ForgotPasswordForm from "@/components/forms/ForgotPasswordForm";
import { createMetadata } from "@/lib/metadata";

export const metadata: Metadata = createMetadata({
  title: "Forgot Password",
  description: "Reset your INDIAN GYM K N RAJU FITNESS account password.",
  path: "/forgot-password",
  noIndex: true,
});

export default function ForgotPasswordPage() {
  return (
    <Suspense>
      <ForgotPasswordForm />
    </Suspense>
  );
}

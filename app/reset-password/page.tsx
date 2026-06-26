import type { Metadata } from "next";
import { Suspense } from "react";
import ResetPasswordForm from "@/components/forms/ResetPasswordForm";
import { createMetadata } from "@/lib/metadata";

export const metadata: Metadata = createMetadata({
  title: "Reset Password",
  description: "Set a new password for your gym account.",
  path: "/reset-password",
  noIndex: true,
});

export default function ResetPasswordPage() {
  return (
    <Suspense>
      <ResetPasswordForm />
    </Suspense>
  );
}

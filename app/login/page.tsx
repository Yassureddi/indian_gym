import type { Metadata } from "next";
import { Suspense } from "react";
import LoginForm from "@/components/forms/LoginForm";
import { createMetadata } from "@/lib/metadata";

export const metadata: Metadata = createMetadata({
  title: "Login",
  description: "Sign in to your INDIAN GYM K N RAJU FITNESS member account.",
  path: "/login",
  noIndex: true,
});

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}

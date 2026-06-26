"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import GlassCard from "@/components/ui/GlassCard";
import Button from "@/components/ui/Button";
import Logo from "@/components/brand/Logo";
import PasswordInput from "@/components/ui/PasswordInput";
import styles from "./LoginForm.module.css";

export default function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setMessage("");

    const formData = new FormData(e.currentTarget);
    const password = formData.get("password") as string;
    const confirm = formData.get("confirm") as string;

    if (password !== confirm) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setMessage("Password updated! Redirecting to login...");
      setTimeout(() => router.push("/login"), 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Reset failed");
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) {
    return (
      <div className={styles.wrapper}>
        <GlassCard className={styles.card} hover={false} padding="lg">
          <p className={styles.error}>Invalid reset link. Please request a new one.</p>
          <p className={styles.signup}>
            <Link href="/forgot-password">Request Reset Link</Link>
          </p>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.bgGlow} aria-hidden="true" />
      <GlassCard className={styles.card} hover={false} padding="lg">
        <div className={styles.header}>
          <Logo variant="login" showText={false} />
          <h1 className="text-h3">Reset Password</h1>
          <p className="text-body-sm">Enter your new password below</p>
        </div>

        {error && <p className={styles.error}>{error}</p>}
        {message && <p className={styles.success}>{message}</p>}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <label htmlFor="password">New Password</label>
            <PasswordInput id="password" name="password" minLength={6} required />
          </div>
          <div className={styles.field}>
            <label htmlFor="confirm">Confirm Password</label>
            <PasswordInput id="confirm" name="confirm" minLength={6} required />
          </div>
          <Button
            type="submit"
            variant="primary"
            size="lg"
            className={styles.submit}
            disabled={isLoading}
          >
            {isLoading ? "Updating..." : "Update Password"}
          </Button>
        </form>
      </GlassCard>
    </div>
  );
}

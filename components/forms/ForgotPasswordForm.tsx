"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import GlassCard from "@/components/ui/GlassCard";
import Button from "@/components/ui/Button";
import Logo from "@/components/brand/Logo";
import styles from "./LoginForm.module.css";

export default function ForgotPasswordForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [resetUrl, setResetUrl] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");
    setResetUrl("");
    setError("");

    const formData = new FormData(e.currentTarget);
    const login = formData.get("login") as string;

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ login }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setMessage(data.message);
      if (data.resetUrl) setResetUrl(data.resetUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Request failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.bgGlow} aria-hidden="true" />
      <GlassCard className={styles.card} hover={false} padding="lg">
        <div className={styles.header}>
          <Logo variant="login" showText={false} />
          <h1 className="text-h3">Forgot Password</h1>
          <p className="text-body-sm">Enter your email or phone to reset your password</p>
        </div>

        {error && <p className={styles.error}>{error}</p>}
        {message && <p className={styles.success}>{message}</p>}
        {resetUrl && (
          <p className={styles.resetLink}>
            <a href={resetUrl}>Click here to reset your password</a>
          </p>
        )}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <label htmlFor="forgot-login">Email or Phone</label>
            <input
              id="forgot-login"
              name="login"
              type="text"
              required
              placeholder="Enter email or phone"
            />
          </div>
          <Button
            type="submit"
            variant="primary"
            size="lg"
            className={styles.submit}
            disabled={isLoading}
          >
            {isLoading ? "Sending..." : "Reset Password"}
          </Button>
        </form>

        <p className={styles.signup}>
          <Link href="/login">← Back to Login</Link>
        </p>
      </GlassCard>
    </div>
  );
}

"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import GlassCard from "@/components/ui/GlassCard";
import Button from "@/components/ui/Button";
import Logo from "@/components/brand/Logo";
import { SITE_SHORT_NAME } from "@/lib/constants";
import styles from "./LoginForm.module.css";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const login = formData.get("email") as string;
    const password = formData.get("password") as string;
    const rememberMe = formData.get("remember") === "on";

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ login, password, rememberMe }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login failed");

      const redirect =
        searchParams.get("redirect") ||
        (data.user.role === "admin" ? "/admin" : "/dashboard");
      router.push(redirect);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
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
          <h1 className="text-h3">Welcome Back</h1>
          <p className="text-body-sm">Sign in to your {SITE_SHORT_NAME} account</p>
        </div>

        {error && <p className={styles.error}>{error}</p>}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <label htmlFor="login-email">Email or Phone</label>
            <input
              id="login-email"
              name="email"
              type="text"
              required
              placeholder="Enter email or phone"
              autoComplete="username"
            />
          </div>
          <div className={styles.field}>
            <label htmlFor="login-password">Password</label>
            <input
              id="login-password"
              name="password"
              type="password"
              required
              placeholder="Enter password"
              autoComplete="current-password"
            />
          </div>
          <div className={styles.options}>
            <label className={styles.remember}>
              <input type="checkbox" name="remember" />
              Remember me
            </label>
            <Link href="/forgot-password" className={styles.forgot}>
              Forgot password?
            </Link>
          </div>
          <Button
            type="submit"
            variant="primary"
            size="lg"
            className={styles.submit}
            disabled={isLoading}
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </Button>
        </form>

        <div className={styles.demo}>
          <p className={styles.demoTitle}>Demo Accounts</p>
          <p>Admin: admin@gym.com / Admin@123</p>
          <p>Member: member@gym.com / Member@123</p>
        </div>

        <p className={styles.signup}>
          Don&apos;t have an account?{" "}
          <Link href="/free-trial">Start Free Trial</Link>
        </p>
      </GlassCard>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminSidebar from "./AdminSidebar";
import NotificationBell from "./NotificationBell";
import type { SessionUser } from "@/lib/auth/types";
import styles from "./AdminShell.module.css";

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<SessionUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;

    fetch("/api/auth/me", { credentials: "include" })
      .then(async (r) => {
        const data = await r.json();
        if (!r.ok) {
          if (r.status === 401) throw new Error("unauthorized");
          throw new Error(data.error || "Failed to load session");
        }
        return data;
      })
      .then((authData) => {
        if (cancelled) return;

        if (authData.user.role !== "admin") {
          router.replace("/dashboard");
          return;
        }

        setUser(authData.user);
      })
      .catch((err) => {
        if (cancelled) return;

        if (err instanceof Error && err.message === "unauthorized") {
          router.replace("/login?redirect=/admin");
          return;
        }

        setError(
          err instanceof Error
            ? err.message
            : "Could not load admin session. Check database connection."
        );
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [router]);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
    window.location.href = "/login";
  };

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner} />
        <p>Loading admin panel...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.loading}>
        <p className={styles.error}>{error}</p>
        <button
          type="button"
          className={styles.retryBtn}
          onClick={() => window.location.reload()}
        >
          Retry
        </button>
        <button
          type="button"
          className={styles.retryBtn}
          onClick={() => {
            window.location.href = "/login?redirect=/admin";
          }}
        >
          Back to login
        </button>
      </div>
    );
  }

  if (!user) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner} />
        <p>Redirecting...</p>
      </div>
    );
  }

  return (
    <div className={styles.shell}>
      <AdminSidebar
        user={user}
        onLogout={handleLogout}
        mobileOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
      />
      <div className={styles.main}>
        <header className={styles.header}>
          <button
            type="button"
            className={styles.menuBtn}
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <span /><span /><span />
          </button>
          <div className={styles.headerText}>
            <p className={styles.eyebrow}>Admin Control Center</p>
            <h1 className={styles.title}>KN Raju Fitness</h1>
          </div>
          <div className={styles.headerActions}>
            <NotificationBell />
            <div className={styles.headerMeta}>
              <span className={styles.liveDot} />
              Live
            </div>
          </div>
        </header>
        <div className={styles.content}>{children}</div>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminSidebar from "./AdminSidebar";
import type { SessionUser } from "@/lib/auth/types";
import styles from "./AdminShell.module.css";

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<SessionUser | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch("/api/auth/me").then((r) => (r.ok ? r.json() : Promise.reject())),
      fetch("/api/admin/overview").then((r) => (r.ok ? r.json() : null)),
    ])
      .then(([authData, overview]) => {
        if (authData.user.role !== "admin") {
          router.replace("/dashboard");
          return;
        }
        setUser(authData.user);
        setUnreadCount(overview?.stats?.unreadNotifications ?? 0);
      })
      .catch(() => router.replace("/login"))
      .finally(() => setLoading(false));
  }, [router]);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.replace("/login");
    router.refresh();
  };

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner} />
        <p>Loading admin panel...</p>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className={styles.shell}>
      <AdminSidebar
        user={user}
        unreadCount={unreadCount}
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
          <div className={styles.headerMeta}>
            <span className={styles.liveDot} />
            Live
          </div>
        </header>
        <div className={styles.content}>{children}</div>
      </div>
    </div>
  );
}

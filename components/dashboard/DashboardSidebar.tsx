"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "@/components/brand/Logo";
import type { SessionUser } from "@/lib/auth/types";
import styles from "./DashboardSidebar.module.css";

const MEMBER_LINKS = [
  { href: "/dashboard", label: "Overview", icon: "◆" },
  { href: "/dashboard/profile", label: "Profile", icon: "◇" },
  { href: "/dashboard/attendance", label: "Attendance", icon: "◈" },
  { href: "/dashboard/membership", label: "Membership", icon: "◉" },
  { href: "/dashboard/workout-plans", label: "Workout Plans", icon: "◎" },
  { href: "/dashboard/diet-plans", label: "Diet Plans", icon: "○" },
];

const ADMIN_LINKS = [
  { href: "/admin", label: "Admin Panel", icon: "★" },
];

interface DashboardSidebarProps {
  user: SessionUser;
  onLogout: () => void;
  mobileOpen: boolean;
  onClose: () => void;
}

export default function DashboardSidebar({
  user,
  onLogout,
  mobileOpen,
  onClose,
}: DashboardSidebarProps) {
  const pathname = usePathname();
  const links = user.role === "admin" ? [...MEMBER_LINKS, ...ADMIN_LINKS] : MEMBER_LINKS;

  return (
    <>
      <div
        className={`${styles.overlay} ${mobileOpen ? styles.overlayOpen : ""}`}
        onClick={onClose}
        aria-hidden="true"
      />
      <aside className={`${styles.sidebar} ${mobileOpen ? styles.open : ""}`}>
        <div className={styles.brand}>
          <Logo variant="navbar" href="/dashboard" />
        </div>

        <div className={styles.user}>
          <div className={styles.avatar}>{user.name.charAt(0).toUpperCase()}</div>
          <div>
            <p className={styles.userName}>{user.name}</p>
            <span className={styles.userRole}>{user.role}</span>
          </div>
        </div>

        <nav className={styles.nav}>
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`${styles.link} ${
                pathname === link.href ? styles.active : ""
              }`}
              onClick={onClose}
            >
              <span className={styles.icon}>{link.icon}</span>
              {link.label}
            </Link>
          ))}
        </nav>

        <div className={styles.footer}>
          <Link href="/" className={styles.backLink}>
            ← Back to Website
          </Link>
          <button type="button" onClick={onLogout} className={styles.logout}>
            Sign Out
          </button>
        </div>
      </aside>
    </>
  );
}

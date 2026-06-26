"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "@/components/brand/Logo";
import AdminIcon from "./AdminIcon";
import { ADMIN_NAV } from "@/lib/admin/nav";
import type { SessionUser } from "@/lib/auth/types";
import styles from "./AdminSidebar.module.css";

interface AdminSidebarProps {
  user: SessionUser;
  onLogout: () => void;
  mobileOpen: boolean;
  onClose: () => void;
}

export default function AdminSidebar({
  user,
  onLogout,
  mobileOpen,
  onClose,
}: AdminSidebarProps) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  };

  return (
    <>
      <div
        className={`${styles.overlay} ${mobileOpen ? styles.overlayVisible : ""}`}
        onClick={onClose}
        aria-hidden="true"
      />
      <aside className={`${styles.sidebar} ${mobileOpen ? styles.open : ""}`}>
        <div className={styles.top}>
          <Logo variant="navbar" href="/admin" />
          <span className={styles.badge}>Admin</span>
        </div>

        <div className={styles.profile}>
          <div className={styles.avatar}>{user.name.charAt(0)}</div>
          <div className={styles.profileInfo}>
            <p className={styles.name}>{user.name}</p>
            <p className={styles.role}>Administrator</p>
          </div>
        </div>

        <nav className={styles.nav}>
          <p className={styles.navLabel}>Menu</p>
          {ADMIN_NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`${styles.link} ${isActive(item.href) ? styles.active : ""}`}
              onClick={onClose}
            >
              <span className={styles.linkIcon}>
                <AdminIcon name={item.icon} size={18} />
              </span>
              <span className={styles.linkText}>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className={styles.bottom}>
          <Link href="/" className={styles.websiteLink}>
            View Website
          </Link>
          <button type="button" onClick={onLogout} className={styles.logout}>
            Sign Out
          </button>
        </div>
      </aside>
    </>
  );
}

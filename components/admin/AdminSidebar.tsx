"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Logo from "@/components/brand/Logo";
import AdminIcon from "./AdminIcon";
import {
  ADMIN_NAV_CONTENT,
  ADMIN_NAV_MAIN,
  ADMIN_NAV_SUPPLEMENTS,
  SUPPLEMENT_NAV_PATHS,
} from "@/lib/admin/nav";
import type { AdminIconName } from "@/lib/admin/nav";
import type { SessionUser } from "@/lib/auth/types";
import styles from "./AdminSidebar.module.css";

interface AdminSidebarProps {
  user: SessionUser;
  onLogout: () => void;
  mobileOpen: boolean;
  onClose: () => void;
}

function NavLink({
  href,
  label,
  icon,
  active,
  onClose,
  nested,
}: {
  href: string;
  label: string;
  icon: AdminIconName;
  active: boolean;
  onClose: () => void;
  nested?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`${styles.link} ${nested ? styles.linkNested : ""} ${active ? styles.active : ""}`}
      onClick={onClose}
    >
      <span className={styles.linkIcon}>
        <AdminIcon name={icon} size={18} />
      </span>
      <span className={styles.linkText}>{label}</span>
    </Link>
  );
}

export default function AdminSidebar({
  user,
  onLogout,
  mobileOpen,
  onClose,
}: AdminSidebarProps) {
  const pathname = usePathname();
  const supplementsOpenDefault = SUPPLEMENT_NAV_PATHS.some((p) => pathname.startsWith(p));
  const [supplementsOpen, setSupplementsOpen] = useState(supplementsOpenDefault);

  useEffect(() => {
    if (SUPPLEMENT_NAV_PATHS.some((p) => pathname.startsWith(p))) {
      setSupplementsOpen(true);
    }
  }, [pathname]);

  const isActive = (href: string) => {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  };

  const supplementsSectionActive = SUPPLEMENT_NAV_PATHS.some((p) => isActive(p));

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
          {ADMIN_NAV_MAIN.map((item) => (
            <NavLink
              key={item.href}
              href={item.href}
              label={item.label}
              icon={item.icon}
              active={isActive(item.href)}
              onClose={onClose}
            />
          ))}

          <div className={styles.navGroup}>
            <button
              type="button"
              className={`${styles.groupToggle} ${supplementsSectionActive ? styles.groupToggleActive : ""}`}
              onClick={() => setSupplementsOpen((o) => !o)}
              aria-expanded={supplementsOpen}
            >
              <span className={styles.groupLeft}>
                <span className={styles.linkIcon}>
                  <AdminIcon name="supplements" size={18} />
                </span>
                <span>Supplements Hub</span>
              </span>
              <span className={`${styles.chevron} ${supplementsOpen ? styles.chevronOpen : ""}`} aria-hidden>
                ▾
              </span>
            </button>
            {supplementsOpen && (
              <div className={styles.groupItems}>
                {ADMIN_NAV_SUPPLEMENTS.map((item) => (
                  <NavLink
                    key={item.href}
                    href={item.href}
                    label={item.label}
                    icon={item.icon}
                    active={isActive(item.href)}
                    onClose={onClose}
                    nested
                  />
                ))}
              </div>
            )}
          </div>

          <p className={styles.navLabel}>Content</p>
          {ADMIN_NAV_CONTENT.map((item) => (
            <NavLink
              key={item.href}
              href={item.href}
              label={item.label}
              icon={item.icon}
              active={isActive(item.href)}
              onClose={onClose}
            />
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

"use client";

import { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { NAV_LINKS } from "@/lib/constants";
import Logo from "@/components/brand/Logo";
import Button from "@/components/ui/Button";
import type { SessionUser } from "@/lib/auth/types";
import styles from "./Header.module.css";

function isNavActive(href: string, pathname: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [user, setUser] = useState<SessionUser | null>(null);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  const closeMobileMenu = useCallback(() => setIsMobileOpen(false), []);
  const openMobileMenu = useCallback(() => setIsMobileOpen(true), []);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 24);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    closeMobileMenu();
  }, [pathname, closeMobileMenu]);

  useEffect(() => {
    document.body.style.overflow = isMobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileOpen]);

  useEffect(() => {
    if (!isMobileOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeMobileMenu();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isMobileOpen, closeMobileMenu]);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => setUser(data?.user ?? null))
      .catch(() => setUser(null));
  }, [pathname]);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    closeMobileMenu();
    window.location.href = "/";
  };

  const mobileNavLinks = user
    ? NAV_LINKS
    : [...NAV_LINKS, { href: "/login", label: "Login" }];

  const mobileMenu = (
    <AnimatePresence>
      {isMobileOpen && (
        <>
          <motion.button
            type="button"
            className={styles.backdrop}
            aria-label="Close menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={closeMobileMenu}
          />
          <motion.aside
            id="mobile-navigation-drawer"
            className={styles.drawer}
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation menu"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 32, stiffness: 320 }}
          >
            <div className={styles.drawerHeader}>
              <span className={styles.drawerTitle}>Menu</span>
              <button
                type="button"
                className={styles.closeBtn}
                onClick={closeMobileMenu}
                aria-label="Close menu"
              >
                <CloseIcon />
              </button>
            </div>

            <nav className={styles.drawerNav} aria-label="Mobile navigation">
              <ul className={styles.mobileNavList}>
                {mobileNavLinks.map((link, i) => (
                  <motion.li
                    key={link.href}
                    initial={{ opacity: 0, x: 16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.04 + i * 0.03, duration: 0.25 }}
                  >
                    <Link
                      href={link.href}
                      className={`${styles.mobileNavLink} ${
                        isNavActive(link.href, pathname) ? styles.active : ""
                      }`}
                      onClick={closeMobileMenu}
                    >
                      {link.label}
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </nav>

            <div className={styles.mobileActions}>
              {user ? (
                <>
                  <Button
                    href={user.role === "admin" ? "/admin" : "/dashboard"}
                    variant="outline"
                    size="md"
                    onClick={closeMobileMenu}
                  >
                    {user.role === "admin" ? "Admin Panel" : "Dashboard"}
                  </Button>
                  <button type="button" onClick={handleLogout} className={styles.mobileLogout}>
                    Logout
                  </button>
                </>
              ) : (
                <Button href="/free-trial" variant="primary" size="md" onClick={closeMobileMenu}>
                  Free Trial
                </Button>
              )}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );

  return (
    <header
      className={`${styles.header} ${isScrolled ? styles.scrolled : ""} ${
        isMobileOpen ? styles.menuOpen : ""
      }`}
    >
      <div className={`container ${styles.inner}`}>
        <div className={styles.brand}>
          <Logo variant="navbar" />
        </div>

        <nav className={styles.nav} aria-label="Main navigation">
          <ul className={styles.navList}>
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`${styles.navLink} ${
                    isNavActive(link.href, pathname) ? styles.active : ""
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className={styles.actions}>
          {user ? (
            <>
              <Button
                href={user.role === "admin" ? "/admin" : "/dashboard"}
                variant="ghost"
                size="sm"
              >
                {user.role === "admin" ? "Admin" : "Dashboard"}
              </Button>
              <button type="button" onClick={handleLogout} className={styles.logoutBtn}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Button href="/login" variant="ghost" size="sm">
                Login
              </Button>
              <Button href="/free-trial" variant="primary" size="sm">
                Free Trial
              </Button>
            </>
          )}
        </div>

        <button
          type="button"
          className={`${styles.hamburger} ${isMobileOpen ? styles.open : ""}`}
          onClick={() => (isMobileOpen ? closeMobileMenu() : openMobileMenu())}
          aria-label={isMobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={isMobileOpen}
          aria-controls="mobile-navigation-drawer"
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      {mounted ? createPortal(mobileMenu, document.body) : null}
    </header>
  );
}

function CloseIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  );
}

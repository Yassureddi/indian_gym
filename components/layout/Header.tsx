"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { NAV_LINKS } from "@/lib/constants";
import Logo from "@/components/brand/Logo";
import Button from "@/components/ui/Button";
import type { SessionUser } from "@/lib/auth/types";
import styles from "./Header.module.css";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [user, setUser] = useState<SessionUser | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = isMobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileOpen]);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => setUser(data?.user ?? null))
      .catch(() => setUser(null));
  }, [pathname]);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    window.location.href = "/";
  };

  return (
    <header
      className={`${styles.header} ${isScrolled ? styles.scrolled : ""}`}
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
                    pathname === link.href ? styles.active : ""
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
          className={`${styles.hamburger} ${isMobileOpen ? styles.open : ""}`}
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          aria-label="Toggle menu"
          aria-expanded={isMobileOpen}
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            className={styles.mobileMenu}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <nav aria-label="Mobile navigation">
              <ul className={styles.mobileNavList}>
                {NAV_LINKS.map((link, i) => (
                  <motion.li
                    key={link.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Link
                      href={link.href}
                      className={`${styles.mobileNavLink} ${
                        pathname === link.href ? styles.active : ""
                      }`}
                    >
                      {link.label}
                    </Link>
                  </motion.li>
                ))}
              </ul>
              <div className={styles.mobileActions}>
                {user ? (
                  <>
                    <Button
                      href={user.role === "admin" ? "/admin" : "/dashboard"}
                      variant="outline"
                      size="md"
                    >
                      {user.role === "admin" ? "Admin" : "Dashboard"}
                    </Button>
                    <button type="button" onClick={handleLogout} className={styles.mobileLogout}>
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Button href="/login" variant="outline" size="md">
                      Login
                    </Button>
                    <Button href="/free-trial" variant="primary" size="md">
                      Free Trial
                    </Button>
                  </>
                )}
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { NAV_LINKS_MORE, NAV_LINKS_PRIMARY } from "@/lib/constants";
import Logo from "@/components/brand/Logo";
import Button from "@/components/ui/Button";
import type { SessionUser } from "@/lib/auth/types";
import styles from "./Header.module.css";

function isNavActive(href: string, pathname: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

function navLabel(link: { label: string; shortLabel?: string | undefined }) {
  return link.shortLabel ?? link.label;
}

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const [user, setUser] = useState<SessionUser | null>(null);
  const moreRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  const moreActive = NAV_LINKS_MORE.some((link) => isNavActive(link.href, pathname));

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 24);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMoreOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!isMoreOpen) return;
    const onClick = (event: MouseEvent) => {
      if (moreRef.current && !moreRef.current.contains(event.target as Node)) {
        setIsMoreOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [isMoreOpen]);

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
    <header className={`${styles.header} ${isScrolled ? styles.scrolled : ""}`}>
      <div className={`container ${styles.inner}`}>
        <div className={styles.brand}>
          <Logo variant="navbar" />
        </div>

        <nav className={styles.nav} aria-label="Main navigation">
          <ul className={styles.navList}>
            {NAV_LINKS_PRIMARY.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`${styles.navLink} ${
                    isNavActive(link.href, pathname) ? styles.active : ""
                  }`}
                >
                  {navLabel(link)}
                </Link>
              </li>
            ))}
            <li>
              <div className={styles.moreWrap} ref={moreRef}>
                <button
                  type="button"
                  className={`${styles.navLink} ${styles.moreBtn} ${
                    moreActive ? styles.active : ""
                  } ${isMoreOpen ? styles.moreBtnOpen : ""}`}
                  aria-expanded={isMoreOpen}
                  aria-haspopup="true"
                  onClick={() => setIsMoreOpen((open) => !open)}
                >
                  More
                  <span className={styles.moreChevron} aria-hidden>
                    ▾
                  </span>
                </button>
                <AnimatePresence>
                  {isMoreOpen && (
                    <motion.div
                      className={styles.moreMenu}
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.18 }}
                    >
                      {NAV_LINKS_MORE.map((link) => (
                        <Link
                          key={link.href}
                          href={link.href}
                          className={`${styles.moreLink} ${
                            isNavActive(link.href, pathname) ? styles.active : ""
                          }`}
                          onClick={() => setIsMoreOpen(false)}
                        >
                          {link.label}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </li>
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
      </div>
    </header>
  );
}

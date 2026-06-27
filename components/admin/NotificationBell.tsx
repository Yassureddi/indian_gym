"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import type { Notification } from "@/lib/admin/notification-types";
import {
  formatNotificationDateTime,
  getNotificationIcon,
} from "@/lib/notifications/display";
import styles from "./NotificationBell.module.css";

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [items, setItems] = useState<Notification[]>([]);
  const wrapRef = useRef<HTMLDivElement>(null);

  const load = useCallback(() => {
    fetch("/api/admin/notifications/unread-count")
      .then((r) => r.json())
      .then((d) => setUnreadCount(d.unreadCount ?? 0))
      .catch(() => {});

    fetch("/api/admin/notifications?limit=5")
      .then((r) => r.json())
      .then((d) => setItems(d.notifications ?? []))
      .catch(() => {});
  }, []);

  useEffect(() => {
    load();
    const interval = setInterval(load, 30000);
    return () => clearInterval(interval);
  }, [load]);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  const markRead = async (id: string) => {
    await fetch(`/api/admin/notifications/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ read: true }),
    });
    load();
  };

  return (
    <div className={styles.bellWrap} ref={wrapRef}>
      <button
        type="button"
        className={styles.bellBtn}
        onClick={() => setOpen((o) => !o)}
        aria-label={`Notifications${unreadCount ? `, ${unreadCount} unread` : ""}`}
        aria-expanded={open}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 01-3.46 0" />
        </svg>
        {unreadCount > 0 && (
          <span className={styles.badge}>
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <>
            <div className={styles.backdrop} onClick={() => setOpen(false)} aria-hidden />
            <motion.div
              className={styles.dropdown}
              initial={{ opacity: 0, y: -8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
              transition={{ duration: 0.2 }}
            >
              <div className={styles.dropdownHeader}>Notifications</div>
              <div className={styles.list}>
                {items.length === 0 ? (
                  <p className={styles.empty}>No notifications yet</p>
                ) : (
                  items.map((n) => (
                    <button
                      key={n.id}
                      type="button"
                      className={`${styles.item} ${!n.read ? styles.itemUnread : ""}`}
                      onClick={() => {
                        if (!n.read) markRead(n.id);
                        setOpen(false);
                      }}
                    >
                      <span className={styles.itemIcon}>
                        {getNotificationIcon(n.type, n.message)}
                      </span>
                      <span className={styles.itemBody}>
                        <span className={styles.itemTitle}>{n.title}</span>
                        <span className={styles.itemMessage}>{n.message}</span>
                        <span className={styles.itemTime}>
                          {formatNotificationDateTime(n.createdAt)}
                        </span>
                      </span>
                    </button>
                  ))
                )}
              </div>
              <div className={styles.footer}>
                <Link
                  href="/admin/notifications"
                  className={styles.viewAll}
                  onClick={() => setOpen(false)}
                >
                  View All Notifications
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

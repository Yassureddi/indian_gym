"use client";

import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import {
  AdminFilterBar,
  AdminSearchInput,
} from "@/components/admin/AdminFilterBar";
import Button from "@/components/ui/Button";
import type { Notification } from "@/lib/admin/notification-types";
import {
  NOTIFICATION_FILTERS,
  type NotificationFilterId,
} from "@/lib/admin/notification-types";
import {
  formatNotificationDateTime,
  getNotificationIcon,
  priorityLabel,
} from "@/lib/notifications/display";
import shared from "@/components/admin/admin-shared.module.css";
import styles from "./page.module.css";

export default function AdminNotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filter, setFilter] = useState<NotificationFilterId>("all");
  const [search, setSearch] = useState("");
  const [date, setDate] = useState("");
  const [message, setMessage] = useState("");

  const load = useCallback(() => {
    const params = new URLSearchParams();
    if (filter !== "all") params.set("type", filter);
    if (search.trim()) params.set("search", search.trim());
    if (date) params.set("date", date);

    return fetch(`/api/admin/notifications?${params}`)
      .then((r) => r.json())
      .then((d) => setNotifications(d.notifications ?? []));
  }, [filter, search, date]);

  useEffect(() => {
    load();
  }, [load]);

  const patchRead = async (id: string, read: boolean) => {
    await fetch(`/api/admin/notifications/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ read }),
    });
    load();
  };

  const remove = async (id: string) => {
    await fetch(`/api/admin/notifications/${id}`, { method: "DELETE" });
    load();
  };

  const markAllRead = async () => {
    const res = await fetch("/api/admin/notifications/mark-all-read", {
      method: "POST",
    });
    const data = await res.json();
    setMessage(`Marked ${data.marked ?? 0} notification(s) as read.`);
    load();
  };

  const clearAll = async () => {
    if (!window.confirm("Clear all notifications? This cannot be undone.")) return;
    const res = await fetch("/api/admin/notifications/clear-all", {
      method: "POST",
    });
    const data = await res.json();
    setMessage(`Cleared ${data.cleared ?? 0} notification(s).`);
    load();
  };

  return (
    <div>
      <AdminPageHeader
        title="Notifications"
        description="Stay updated on memberships, payments, store activity, and system alerts."
      />

      {message && (
        <p className={`${shared.alert} ${shared.alertSuccess}`}>{message}</p>
      )}

      <div className={styles.pageActions}>
        <Button type="button" variant="outline" size="sm" onClick={markAllRead}>
          Mark All as Read
        </Button>
        <Button type="button" variant="outline" size="sm" onClick={clearAll}>
          Clear All Notifications
        </Button>
      </div>

      <div className={styles.filters}>
        {NOTIFICATION_FILTERS.map((f) => (
          <button
            key={f.id}
            type="button"
            className={`${styles.filterChip} ${
              filter === f.id ? styles.filterChipActive : ""
            }`}
            onClick={() => setFilter(f.id)}
          >
            {f.label}
          </button>
        ))}
      </div>

      <AdminFilterBar>
        <div className={styles.filterRow}>
          <AdminSearchInput
            value={search}
            onChange={setSearch}
            placeholder="Search notifications…"
          />
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className={styles.dateInput}
            aria-label="Filter by date"
          />
          {date && (
            <Button type="button" variant="outline" size="sm" onClick={() => setDate("")}>
              Clear Date
            </Button>
          )}
        </div>
      </AdminFilterBar>

      {notifications.length === 0 ? (
        <p className={styles.empty}>No notifications match your filters.</p>
      ) : (
        <div className={styles.list}>
          {notifications.map((n, index) => (
            <motion.article
              key={n.id}
              className={`${styles.card} ${!n.read ? styles.cardUnread : ""}`}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.03, duration: 0.35 }}
            >
              <span className={styles.icon}>{getNotificationIcon(n.type, n.message)}</span>

              <div className={styles.body}>
                <div className={styles.titleRow}>
                  <h3 className={styles.title}>{n.title}</h3>
                  <span className={styles.badgeType}>{n.type}</span>
                  <span
                    className={
                      (n.priority ?? "medium") === "high"
                        ? styles.badgePriorityHigh
                        : (n.priority ?? "medium") === "medium"
                          ? styles.badgePriorityMedium
                          : styles.badgePriorityLow
                    }
                  >
                    {priorityLabel(n.priority)}
                  </span>
                  <span className={n.read ? styles.badgeRead : styles.badgeUnread}>
                    {n.read ? "Read" : "Unread"}
                  </span>
                </div>
                <p className={styles.message}>{n.message}</p>
                <div className={styles.meta}>
                  {n.memberName && (
                    <span>
                      <strong>Member:</strong> {n.memberName}
                    </span>
                  )}
                  <span>
                    <strong>Date:</strong> {formatNotificationDateTime(n.createdAt)}
                  </span>
                </div>
              </div>

              <div className={styles.actions}>
                {n.read ? (
                  <button
                    type="button"
                    className={styles.actionBtn}
                    onClick={() => patchRead(n.id, false)}
                  >
                    Mark Unread
                  </button>
                ) : (
                  <button
                    type="button"
                    className={styles.actionBtn}
                    onClick={() => patchRead(n.id, true)}
                  >
                    Mark Read
                  </button>
                )}
                <button
                  type="button"
                  className={`${styles.actionBtn} ${styles.actionBtnDanger}`}
                  onClick={() => remove(n.id)}
                >
                  Delete
                </button>
              </div>
            </motion.article>
          ))}
        </div>
      )}
    </div>
  );
}

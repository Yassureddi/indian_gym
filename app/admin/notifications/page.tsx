"use client";

import { FormEvent, useEffect, useState } from "react";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import Button from "@/components/ui/Button";
import type { Notification } from "@/lib/admin/types";
import shared from "@/components/admin/admin-shared.module.css";
import styles from "./page.module.css";

export default function AdminNotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);

  const load = () =>
    fetch("/api/admin/notifications")
      .then((r) => r.json())
      .then((d) => setNotifications(d.notifications ?? []));

  useEffect(() => { load(); }, []);

  const markRead = async (id: string) => {
    await fetch("/api/admin/notifications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "mark_read", id }),
    });
    load();
  };

  const handleCreate = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    await fetch("/api/admin/notifications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: fd.get("title"),
        message: fd.get("message"),
        type: fd.get("type"),
      }),
    });
    e.currentTarget.reset();
    setLoading(false);
    load();
  };

  return (
    <div>
      <AdminPageHeader
        title="Notifications"
        description="Send alerts and manage gym notifications."
      />

      <div className={shared.grid2} style={{ marginBottom: "1.5rem" }}>
        <div className={shared.panel}>
          <h3 style={{ marginBottom: "1rem", fontFamily: "var(--font-heading)" }}>Send Notification</h3>
          <form onSubmit={handleCreate} className={shared.formGrid}>
            <div className={`${shared.field} ${shared.fullWidth}`}>
              <label>Title</label>
              <input name="title" required />
            </div>
            <div className={`${shared.field} ${shared.fullWidth}`}>
              <label>Message</label>
              <textarea name="message" rows={3} required />
            </div>
            <div className={shared.field}>
              <label>Type</label>
              <select name="type">
                <option value="info">Info</option>
                <option value="success">Success</option>
                <option value="warning">Warning</option>
                <option value="alert">Alert</option>
              </select>
            </div>
            <div className={shared.field} style={{ display: "flex", alignItems: "flex-end" }}>
              <Button type="submit" variant="primary" disabled={loading}>Send</Button>
            </div>
          </form>
        </div>
      </div>

      <ul className={styles.list}>
        {notifications.map((n) => (
          <li key={n.id} className={`${styles.item} ${!n.read ? styles.unread : ""}`}>
            <div className={styles.dot} data-type={n.type} />
            <div className={styles.content}>
              <strong>{n.title}</strong>
              <p>{n.message}</p>
              <time>{new Date(n.createdAt).toLocaleString("en-IN")}</time>
            </div>
            {!n.read && (
              <button type="button" onClick={() => markRead(n.id)} className={styles.markRead}>
                Mark read
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

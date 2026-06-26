"use client";

import { FormEvent, useEffect, useState } from "react";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import { AdminTable } from "@/components/admin/AdminTable";
import Button from "@/components/ui/Button";
import type { SessionUser } from "@/lib/auth/types";
import shared from "@/components/admin/admin-shared.module.css";

export default function AdminMembersPage() {
  const [members, setMembers] = useState<SessionUser[]>([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const load = () =>
    fetch("/api/admin/members")
      .then((r) => r.json())
      .then((d) => setMembers(d.members ?? []));

  useEffect(() => { load(); }, []);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");
    const fd = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/admin/members", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: fd.get("name"),
          email: fd.get("email"),
          phone: fd.get("phone"),
          password: fd.get("password"),
          goal: fd.get("goal"),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setMessage("Member created successfully.");
      e.currentTarget.reset();
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <AdminPageHeader
        title="Members"
        description="Manage gym members, create accounts, and view member details."
      />
      {message && <p className={`${shared.alert} ${shared.alertSuccess}`}>{message}</p>}
      {error && <p className={`${shared.alert} ${shared.alertError}`}>{error}</p>}

      <div className={shared.grid2}>
        <div className={shared.panel}>
          <h3 style={{ marginBottom: "1rem", fontFamily: "var(--font-heading)" }}>Add Member</h3>
          <form onSubmit={handleSubmit} className={shared.formGrid}>
            <div className={shared.field}>
              <label htmlFor="name">Full Name</label>
              <input id="name" name="name" required />
            </div>
            <div className={shared.field}>
              <label htmlFor="email">Email</label>
              <input id="email" name="email" type="email" required />
            </div>
            <div className={shared.field}>
              <label htmlFor="phone">Phone</label>
              <input id="phone" name="phone" type="tel" required />
            </div>
            <div className={shared.field}>
              <label htmlFor="password">Password</label>
              <input id="password" name="password" type="password" minLength={6} required />
            </div>
            <div className={`${shared.field} ${shared.fullWidth}`}>
              <label htmlFor="goal">Fitness Goal</label>
              <input id="goal" name="goal" placeholder="e.g. Weight Loss" />
            </div>
            <div className={shared.fullWidth}>
              <Button type="submit" variant="primary" disabled={loading}>
                Create Member
              </Button>
            </div>
          </form>
        </div>

        <AdminTable headers={["Name", "Email", "Phone", "Goal"]}>
          {members.map((m) => (
            <tr key={m.id}>
              <td><strong>{m.name}</strong></td>
              <td>{m.email}</td>
              <td>{m.phone}</td>
              <td>{m.goal || "—"}</td>
            </tr>
          ))}
        </AdminTable>
      </div>
    </div>
  );
}

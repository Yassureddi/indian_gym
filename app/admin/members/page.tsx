"use client";

import { useEffect, useState } from "react";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import CreateMemberModal from "@/components/admin/CreateMemberModal";
import { AdminTable } from "@/components/admin/AdminTable";
import Button from "@/components/ui/Button";
import type { SessionUser } from "@/lib/auth/types";
import shared from "@/components/admin/admin-shared.module.css";

function formatDate(date?: string) {
  if (!date) return "—";
  return new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function AdminMembersPage() {
  const [members, setMembers] = useState<SessionUser[]>([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [createOpen, setCreateOpen] = useState(false);

  const load = () =>
    fetch("/api/admin/members")
      .then((r) => r.json())
      .then((d) => setMembers(d.members ?? []));

  useEffect(() => {
    load();
  }, []);

  const handleSuccess = (msg: string) => {
    setMessage(msg);
    setError("");
    load();
  };

  return (
    <div>
      <AdminPageHeader
        title="Members"
        description="Create members with service plan selection and payment in one workflow."
        action={
          <Button type="button" variant="primary" onClick={() => setCreateOpen(true)}>
            Create Member
          </Button>
        }
      />
      {message && <p className={`${shared.alert} ${shared.alertSuccess}`}>{message}</p>}
      {error && <p className={`${shared.alert} ${shared.alertError}`}>{error}</p>}

      <AdminTable headers={["Name", "ID", "Phone", "Gender", "Age", "Joined", "Goal"]}>
        {members.length === 0 ? (
          <tr>
            <td colSpan={7} style={{ textAlign: "center", color: "var(--color-text-muted)" }}>
              No members yet. Click Create Member to add one.
            </td>
          </tr>
        ) : (
          members.map((m) => (
            <tr key={m.id}>
              <td><strong>{m.name}</strong></td>
              <td style={{ fontSize: "0.75rem", color: "var(--color-text-muted)" }}>{m.id}</td>
              <td>{m.phone}</td>
              <td>{m.gender || "—"}</td>
              <td>{m.age ?? "—"}</td>
              <td>{formatDate(m.joiningDate)}</td>
              <td>{m.goal || "—"}</td>
            </tr>
          ))
        )}
      </AdminTable>

      <CreateMemberModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onSuccess={handleSuccess}
      />
    </div>
  );
}

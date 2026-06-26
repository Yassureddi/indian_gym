"use client";

import { useEffect, useState } from "react";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import MemberOnboardingWizard from "@/components/admin/MemberOnboardingWizard";
import { AdminTable } from "@/components/admin/AdminTable";
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
      />
      {message && <p className={`${shared.alert} ${shared.alertSuccess}`}>{message}</p>}
      {error && <p className={`${shared.alert} ${shared.alertError}`}>{error}</p>}

      <div className={shared.grid2}>
        <div className={shared.panel}>
          <h3 style={{ marginBottom: "1rem", fontFamily: "var(--font-heading)" }}>
            New Member Registration
          </h3>
          <MemberOnboardingWizard
            onSuccess={handleSuccess}
            onError={setError}
          />
        </div>

        <AdminTable headers={["Name", "ID", "Phone", "Gender", "Age", "Joined", "Goal"]}>
          {members.map((m) => (
            <tr key={m.id}>
              <td><strong>{m.name}</strong></td>
              <td style={{ fontSize: "0.75rem", color: "var(--color-text-muted)" }}>{m.id}</td>
              <td>{m.phone}</td>
              <td>{m.gender || "—"}</td>
              <td>{m.age ?? "—"}</td>
              <td>{formatDate(m.joiningDate)}</td>
              <td>{m.goal || "—"}</td>
            </tr>
          ))}
        </AdminTable>
      </div>
    </div>
  );
}

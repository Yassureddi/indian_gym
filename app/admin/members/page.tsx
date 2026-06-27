"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import CreateMemberModal from "@/components/admin/CreateMemberModal";
import MembershipRenewalModal from "@/components/admin/MembershipRenewalModal";
import { AdminTable } from "@/components/admin/AdminTable";
import Button from "@/components/ui/Button";
import type { AdminMemberRow } from "@/lib/admin/member-types";
import {
  isRenewalEnabled,
  MEMBERSHIP_RENEWAL_WINDOW_DAYS,
} from "@/lib/membership-utils";
import shared from "@/components/admin/admin-shared.module.css";
import styles from "./page.module.css";

function formatDate(date?: string) {
  if (!date) return "—";
  return new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function StatusBadge({ member }: { member: AdminMemberRow }) {
  const status = member.membership?.displayStatus ?? "none";
  if (status === "none") {
    return <span className={styles.badgeNone}>No Plan</span>;
  }
  if (status === "expired") {
    return <span className={styles.badgeExpired}>Expired</span>;
  }
  if (status === "expiring") {
    return <span className={styles.badgeExpiring}>Expiring Soon</span>;
  }
  return <span className={styles.badgeActive}>Active</span>;
}

export default function AdminMembersPage() {
  const [members, setMembers] = useState<AdminMemberRow[]>([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [renewMember, setRenewMember] = useState<AdminMemberRow | null>(null);

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

  const expiringMembers = members.filter((m) => m.membership?.displayStatus === "expiring");
  const expiredMembers = members.filter((m) => m.membership?.displayStatus === "expired");

  return (
    <div>
      <AdminPageHeader
        title="Members"
        description="Create members, renew memberships, and manage gym members in one place."
        action={
          <Button type="button" variant="primary" onClick={() => setCreateOpen(true)}>
            Create Member
          </Button>
        }
      />
      {message && <p className={`${shared.alert} ${shared.alertSuccess}`}>{message}</p>}
      {error && <p className={`${shared.alert} ${shared.alertError}`}>{error}</p>}

      {expiredMembers.length > 0 && (
        <div className={`${shared.alert} ${styles.alertExpired}`} role="alert">
          <strong>{expiredMembers.length} membership{expiredMembers.length === 1 ? "" : "s"} expired.</strong>{" "}
          Renew now:{" "}
          {expiredMembers.map((m) => m.name).join(", ")}.
        </div>
      )}

      {expiringMembers.length > 0 && (
        <div className={`${shared.alert} ${styles.alertExpiring}`} role="alert">
          <strong>
            {expiringMembers.length} membership{expiringMembers.length === 1 ? "" : "s"} expiring within{" "}
            {MEMBERSHIP_RENEWAL_WINDOW_DAYS} days.
          </strong>{" "}
          Renew is now available for:{" "}
          {expiringMembers
            .map((m) => `${m.name} (${formatDate(m.membership?.endDate)})`)
            .join(", ")}
          .
        </div>
      )}

      <div className={shared.tableWrap}>
        <AdminTable
          headers={[
            "Name",
            "ID",
            "Phone",
            "Plan",
            "Expiry",
            "Status",
            "Joined",
            "Actions",
          ]}
        >
          {members.length === 0 ? (
            <tr>
              <td colSpan={8} style={{ textAlign: "center", color: "var(--color-text-muted)" }}>
                No members yet. Click Create Member to add one.
              </td>
            </tr>
          ) : (
            members.map((m) => {
              const status = m.membership?.displayStatus;
              const isExpired = status === "expired";
              const isExpiring = status === "expiring";
              const renewEnabled = isRenewalEnabled(m.membership);
              return (
                <tr
                  key={m.id}
                  className={
                    isExpired ? styles.expiredRow : isExpiring ? styles.expiringRow : undefined
                  }
                >
                  <td>
                    <Link href={`/admin/members/${m.id}`} className={styles.memberLink}>
                      <strong>{m.name}</strong>
                    </Link>
                  </td>
                  <td className={styles.muted}>{m.id}</td>
                  <td>{m.phone}</td>
                  <td>{m.membership?.billingPlan ?? "—"}</td>
                  <td>{formatDate(m.membership?.endDate)}</td>
                  <td><StatusBadge member={m} /></td>
                  <td>{formatDate(m.joiningDate)}</td>
                  <td>
                    <button
                      type="button"
                      className={`${styles.renewBtn} ${
                        isExpired
                          ? styles.renewBtnUrgent
                          : isExpiring
                            ? styles.renewBtnExpiring
                            : ""
                      } ${!renewEnabled ? styles.renewBtnDisabled : ""}`}
                      disabled={!renewEnabled}
                      title={
                        renewEnabled
                          ? "Renew membership"
                          : `Renewal opens ${MEMBERSHIP_RENEWAL_WINDOW_DAYS} days before expiry (${formatDate(m.membership?.endDate)})`
                      }
                      onClick={() => setRenewMember(m)}
                    >
                      Renew
                    </button>
                  </td>
                </tr>
              );
            })
          )}
        </AdminTable>
      </div>

      <CreateMemberModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onSuccess={handleSuccess}
      />

      <MembershipRenewalModal
        member={renewMember}
        open={Boolean(renewMember)}
        onClose={() => setRenewMember(null)}
        onSuccess={handleSuccess}
      />
    </div>
  );
}

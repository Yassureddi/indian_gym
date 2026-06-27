"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import MembershipPaymentSchedule from "@/components/admin/MembershipPaymentSchedule";
import MembershipRenewalModal from "@/components/admin/MembershipRenewalModal";
import Button from "@/components/ui/Button";
import type { AdminMemberDetails } from "@/lib/admin/member-types";
import type { MembershipInstallment } from "@/lib/membership-schedule";
import shared from "@/components/admin/admin-shared.module.css";
import styles from "./page.module.css";

function formatDate(date?: string | null) {
  if (!date) return "—";
  return new Date(date + "T00:00:00").toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function MemberDetailsPage() {
  const params = useParams();
  const id = params.id as string;

  const [details, setDetails] = useState<AdminMemberDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [payInstallment, setPayInstallment] = useState<MembershipInstallment | null>(null);
  const [renewOpen, setRenewOpen] = useState(false);

  const load = useCallback(() => {
    setLoading(true);
    setError("");
    return fetch(`/api/admin/members/${id}`)
      .then(async (r) => {
        const data = await r.json();
        if (!r.ok) throw new Error(data.error || "Failed to load member");
        setDetails(data);
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : "Failed to load member");
        setDetails(null);
      })
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  const handleSuccess = (msg: string) => {
    setMessage(msg);
    setPayInstallment(null);
    setRenewOpen(false);
    load();
  };

  if (loading) {
    return <p className={styles.loading}>Loading member details…</p>;
  }

  if (error || !details) {
    return (
      <div>
        <Link href="/admin/members" className={styles.backLink}>
          ← Back to Members
        </Link>
        <p className={styles.error}>{error || "Member not found"}</p>
      </div>
    );
  }

  const { member, schedule } = details;
  const m = member.membership;
  const nextStatus = schedule.nextStatus;

  return (
    <div>
      <Link href="/admin/members" className={styles.backLink}>
        ← Back to Members
      </Link>

      <AdminPageHeader
        title={member.name}
        description={`Member ID: ${member.id} · ${member.phone}`}
        action={
          <div className={styles.headerActions}>
            <Button type="button" variant="outline" onClick={() => setRenewOpen(true)}>
              Renew Membership
            </Button>
          </div>
        }
      />

      {message && <p className={`${shared.alert} ${shared.alertSuccess}`}>{message}</p>}

      <motion.div
        className={`${styles.nextPaymentCard} ${
          nextStatus === "overdue" ? styles.overdue : ""
        }`}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className={styles.nextPaymentLabel}>Next Payment Due</div>
        <div className={styles.nextPaymentGrid}>
          <div className={styles.nextPaymentItem}>
            <span>Due Date</span>
            <strong>{formatDate(schedule.nextDueDate)}</strong>
          </div>
          <div className={styles.nextPaymentItem}>
            <span>Days Remaining</span>
            <strong>
              {schedule.daysRemaining != null
                ? schedule.daysRemaining < 0
                  ? `${Math.abs(schedule.daysRemaining)} Days Overdue`
                  : `${schedule.daysRemaining} Days`
                : "—"}
            </strong>
          </div>
          <div className={styles.nextPaymentItem}>
            <span>Status</span>
            <span
              className={
                nextStatus === "overdue"
                  ? styles.statusOverdue
                  : nextStatus === "upcoming"
                    ? styles.statusUpcoming
                    : nextStatus === "paid"
                      ? styles.statusPaid
                      : styles.statusNone
              }
            >
              {nextStatus === "none"
                ? "No Schedule"
                : nextStatus.charAt(0).toUpperCase() + nextStatus.slice(1)}
            </span>
          </div>
          {m && (
            <div className={styles.nextPaymentItem}>
              <span>Membership Expiry</span>
              <strong>{formatDate(m.endDate)}</strong>
            </div>
          )}
        </div>
      </motion.div>

      <motion.section
        className={styles.memberCard}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.4 }}
      >
        <h3 className={styles.memberCardTitle}>Member Information</h3>
        <div className={styles.infoGrid}>
          <div>
            <span className={styles.infoLabel}>Email</span>
            <span className={styles.infoValue}>{member.email}</span>
          </div>
          <div>
            <span className={styles.infoLabel}>Joining Date</span>
            <span className={styles.infoValue}>{formatDate(member.joiningDate)}</span>
          </div>
          <div>
            <span className={styles.infoLabel}>Current Plan</span>
            <span className={styles.infoValue}>{m?.billingPlan ?? "—"}</span>
          </div>
          <div>
            <span className={styles.infoLabel}>Current Service</span>
            <span className={styles.infoValue}>{m?.serviceName ?? "—"}</span>
          </div>
          <div>
            <span className={styles.infoLabel}>Membership Status</span>
            <span className={styles.infoValue}>
              {m?.displayStatus === "expired"
                ? "Expired"
                : m?.displayStatus === "expiring"
                  ? "Expiring Soon"
                  : m
                    ? "Active"
                    : "No Plan"}
            </span>
          </div>
          <div>
            <span className={styles.infoLabel}>Remaining Days</span>
            <span className={styles.infoValue}>
              {m
                ? m.remainingDays < 0
                  ? "Expired"
                  : `${m.remainingDays} days`
                : "—"}
            </span>
          </div>
        </div>
      </motion.section>

      <MembershipPaymentSchedule
        installments={schedule.installments}
        onPayNow={(installment) => setPayInstallment(installment)}
      />

      <MembershipRenewalModal
        member={member}
        open={renewOpen || Boolean(payInstallment)}
        onClose={() => {
          setRenewOpen(false);
          setPayInstallment(null);
        }}
        onSuccess={handleSuccess}
        mode={payInstallment ? "schedule" : "renewal"}
        dueDate={payInstallment?.dueDate ?? null}
        installmentNo={payInstallment?.installmentNo ?? null}
      />
    </div>
  );
}

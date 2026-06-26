"use client";

import { useEffect, useState } from "react";
import { StatusBadge } from "@/components/admin/AdminTable";
import type { PaymentDetails } from "@/lib/admin/types";
import styles from "./PaymentDetailsModal.module.css";

interface PaymentDetailsModalProps {
  paymentId: string | null;
  onClose: () => void;
}

function formatDate(date?: string) {
  if (!date) return "—";
  return new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function PaymentDetailsModal({
  paymentId,
  onClose,
}: PaymentDetailsModalProps) {
  const [details, setDetails] = useState<PaymentDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!paymentId) {
      setDetails(null);
      return;
    }

    setLoading(true);
    setError("");
    fetch(`/api/admin/payments/${paymentId}`)
      .then(async (r) => {
        const data = await r.json();
        if (!r.ok) throw new Error(data.error || "Failed to load payment details");
        setDetails(data);
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : "Failed to load");
        setDetails(null);
      })
      .finally(() => setLoading(false));
  }, [paymentId]);

  if (!paymentId) return null;

  return (
    <div className={styles.overlay} onClick={onClose} role="presentation">
      <div
        className={styles.modal}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-labelledby="payment-details-title"
      >
        <div className={styles.header}>
          <h2 id="payment-details-title" className={styles.title}>
            Payment Details
          </h2>
          <button type="button" className={styles.closeBtn} onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>

        {loading && <p className={styles.loading}>Loading…</p>}
        {error && <p className={styles.error}>{error}</p>}

        {details && !loading && (
          <>
            <section className={styles.section}>
              <h3 className={styles.sectionTitle}>Member Details</h3>
              <div className={styles.detailGrid}>
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>Member Name</span>
                  <span className={styles.detailValue}>{details.member.name}</span>
                </div>
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>Member ID</span>
                  <span className={styles.detailValue}>{details.member.id}</span>
                </div>
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>Phone Number</span>
                  <span className={styles.detailValue}>{details.member.phone}</span>
                </div>
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>Gender</span>
                  <span className={styles.detailValue}>{details.member.gender || "—"}</span>
                </div>
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>Age</span>
                  <span className={styles.detailValue}>
                    {details.member.age != null ? details.member.age : "—"}
                  </span>
                </div>
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>Joining Date</span>
                  <span className={styles.detailValue}>
                    {formatDate(details.member.joiningDate)}
                  </span>
                </div>
              </div>
            </section>

            <section className={styles.section}>
              <h3 className={styles.sectionTitle}>Service Details</h3>
              <div className={styles.detailGrid}>
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>Selected Service Plan</span>
                  <span className={styles.detailValue}>{details.membership.planName}</span>
                </div>
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>Membership Duration</span>
                  <span className={styles.detailValue}>
                    {details.membership.membershipDuration}
                  </span>
                </div>
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>Plan Price</span>
                  <span className={styles.detailValue}>
                    ₹{details.membership.planPrice.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>
            </section>

            <section className={styles.section}>
              <h3 className={styles.sectionTitle}>Payment Information</h3>
              <div className={styles.detailGrid}>
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>Payment Method</span>
                  <span className={styles.detailValue}>
                    <StatusBadge status={details.payment.method} />
                  </span>
                </div>
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>Payment Status</span>
                  <span className={styles.detailValue}>
                    <StatusBadge status={details.payment.status} />
                  </span>
                </div>
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>Payment Date</span>
                  <span className={styles.detailValue}>{formatDate(details.payment.date)}</span>
                </div>
                {details.payment.method === "upi" && details.payment.reference && (
                  <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>Transaction Reference</span>
                    <span className={styles.detailValue}>{details.payment.reference}</span>
                  </div>
                )}
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  );
}

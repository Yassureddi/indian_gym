"use client";

import { useCallback, useEffect, useState } from "react";
import { StatusBadge } from "@/components/admin/AdminTable";
import type { PaymentDetails } from "@/lib/admin/types";
import {
  downloadPaymentReceipt,
  sharePaymentReceipt,
} from "@/lib/payment-receipt";
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
  const [actionMessage, setActionMessage] = useState("");
  const [sharing, setSharing] = useState(false);

  useEffect(() => {
    if (!paymentId) {
      setDetails(null);
      return;
    }

    setLoading(true);
    setError("");
    setActionMessage("");
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

  useEffect(() => {
    if (!paymentId) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [paymentId, onClose]);

  useEffect(() => {
    if (!paymentId) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [paymentId]);

  const handleDownload = useCallback(() => {
    if (!details) return;
    downloadPaymentReceipt(details);
    setActionMessage("Receipt downloaded. Open the file and use Print to save as PDF.");
  }, [details]);

  const handleShare = useCallback(async () => {
    if (!details) return;
    setSharing(true);
    setActionMessage("");
    try {
      const result = await sharePaymentReceipt(details);
      if (!result.ok) return;
      if (result.method === "clipboard") {
        setActionMessage("Receipt copied to clipboard.");
      } else if (result.method === "whatsapp") {
        setActionMessage("Opening WhatsApp to share receipt.");
      } else {
        setActionMessage("Receipt shared successfully.");
      }
    } catch {
      setActionMessage("Could not share receipt. Try downloading instead.");
    } finally {
      setSharing(false);
    }
  }, [details]);

  if (!paymentId) return null;

  return (
    <div className={styles.overlay} onClick={onClose} role="presentation">
      <div
        className={styles.modal}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-labelledby="payment-details-title"
        aria-modal="true"
      >
        <div className={styles.accentBar} aria-hidden="true" />

        <div className={styles.modalBody}>
          <div className={styles.header}>
            <div>
              <h2 id="payment-details-title" className={styles.title}>
                Payment Details
              </h2>
              {details && (
                <p className={styles.subtitle}>Receipt ID: {details.payment.id}</p>
              )}
            </div>
            <button
              type="button"
              className={styles.closeBtn}
              onClick={onClose}
              aria-label="Close"
            >
              ×
            </button>
          </div>

          {loading && <p className={styles.loading}>Loading payment details…</p>}
          {error && <p className={styles.error}>{error}</p>}

          {details && !loading && (
            <>
              <div className={styles.summaryCard}>
                <div>
                  <p className={styles.summaryAmount}>
                    ₹{details.payment.amount.toLocaleString("en-IN")}
                  </p>
                </div>
                <div className={styles.summaryMeta}>
                  <StatusBadge status={details.payment.status} />
                  <span className={styles.summaryDate}>
                    {formatDate(details.payment.date)}
                  </span>
                </div>
              </div>

              <section className={styles.section}>
                <h3 className={styles.sectionTitle}>Member Details</h3>
                <div className={styles.detailGrid}>
                  <DetailRow label="Member Name" value={details.member.name} />
                  <DetailRow label="Member ID" value={details.member.id} />
                  <DetailRow label="Phone Number" value={details.member.phone} />
                  <DetailRow label="Gender" value={details.member.gender || "—"} />
                  <DetailRow
                    label="Age"
                    value={details.member.age != null ? String(details.member.age) : "—"}
                  />
                  <DetailRow
                    label="Joining Date"
                    value={formatDate(details.member.joiningDate)}
                  />
                </div>
              </section>

              <section className={styles.section}>
                <h3 className={styles.sectionTitle}>Service Details</h3>
                <div className={styles.detailGrid}>
                  <DetailRow label="Selected Service Plan" value={details.membership.planName} />
                  <DetailRow
                    label="Membership Duration"
                    value={details.membership.membershipDuration}
                  />
                  <DetailRow
                    label="Plan Price"
                    value={`₹${details.membership.planPrice.toLocaleString("en-IN")}`}
                  />
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
                  <DetailRow label="Payment Date" value={formatDate(details.payment.date)} />
                  {details.payment.method === "upi" && details.payment.reference && (
                    <DetailRow
                      label="Transaction Reference"
                      value={details.payment.reference}
                    />
                  )}
                </div>
              </section>
            </>
          )}
        </div>

        {details && !loading && (
          <div className={styles.footer}>
            <div className={styles.actionRow}>
              <button
                type="button"
                className={`${styles.actionBtn} ${styles.downloadBtn}`}
                onClick={handleDownload}
              >
                <DownloadIcon />
                Download Receipt
              </button>
              <button
                type="button"
                className={`${styles.actionBtn} ${styles.shareBtn}`}
                onClick={handleShare}
                disabled={sharing}
              >
                <ShareIcon />
                {sharing ? "Sharing…" : "Share Receipt"}
              </button>
            </div>
            {actionMessage && <p className={styles.toast}>{actionMessage}</p>}
          </div>
        )}
      </div>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className={styles.detailRow}>
      <span className={styles.detailLabel}>{label}</span>
      <span className={styles.detailValue}>{value}</span>
    </div>
  );
}

function DownloadIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
    </svg>
  );
}

function ShareIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <path d="M8.59 13.51l6.83 3.98M15.41 6.51l-6.82 3.98" />
    </svg>
  );
}

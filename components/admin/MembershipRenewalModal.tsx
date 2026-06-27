"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Button from "@/components/ui/Button";
import type { AdminMemberRow } from "@/lib/admin/member-types";
import type { BillingPeriod, MembershipCategory } from "@/lib/membership";
import { MEMBERSHIP_PLANS, PAYMENT_MODES } from "@/lib/membership";
import { getPlanSelection } from "@/lib/membership";
import {
  MEMBERSHIP_RENEWAL_WINDOW_DAYS,
} from "@/lib/membership-utils";
import styles from "./MembershipRenewalModal.module.css";

interface MembershipRenewalModalProps {
  member: AdminMemberRow | null;
  open: boolean;
  onClose: () => void;
  onSuccess: (message: string) => void;
  mode?: "renewal" | "schedule";
  dueDate?: string | null;
  installmentNo?: number | null;
}

function formatDate(date?: string) {
  if (!date) return "—";
  return new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function MembershipRenewalModal({
  member,
  open,
  onClose,
  onSuccess,
  mode = "renewal",
  dueDate = null,
  installmentNo = null,
}: MembershipRenewalModalProps) {
  const [selectedPlan, setSelectedPlan] = useState<BillingPeriod | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<MembershipCategory | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "upi" | null>(null);
  const [reference, setReference] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open || !member) return;

    setError("");
    setReference("");
    setPaymentMethod(null);
    setLoading(false);

    if (member.membership) {
      const [period, category] = member.membership.planId.split(":") as [
        BillingPeriod,
        MembershipCategory,
      ];
      setSelectedPlan(period ?? "monthly");
      setSelectedCategory(category ?? "strength");
    } else {
      setSelectedPlan("monthly");
      setSelectedCategory("strength");
    }

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, onClose, member]);

  if (!open || !member) return null;

  const planSelection =
    selectedPlan && selectedCategory
      ? getPlanSelection(selectedPlan, selectedCategory)
      : null;

  const m = member.membership;
  const statusLabel =
    m?.displayStatus === "expired"
      ? "Expired"
      : m?.displayStatus === "expiring"
        ? "Expiring Soon"
        : m?.status === "active"
          ? "Active"
          : m
            ? m.status
            : "No Membership";

  const showExpiryAlert =
    m?.displayStatus === "expiring" || m?.displayStatus === "expired";

  const isSchedule = mode === "schedule" && Boolean(dueDate);

  const handleConfirm = async () => {
    if (!selectedPlan || !selectedCategory || !paymentMethod) {
      setError("Please select a plan and payment method.");
      return;
    }
    if (paymentMethod === "upi" && !reference.trim()) {
      setError("UPI transaction reference is required.");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const endpoint = isSchedule
        ? `/api/admin/members/${member.id}/pay`
        : `/api/admin/members/${member.id}/renew`;
      const body = isSchedule
        ? {
            dueDate,
            planId: selectedPlan,
            categoryId: selectedCategory,
            paymentMethod,
            reference: paymentMethod === "upi" ? reference.trim() : undefined,
          }
        : {
            planId: selectedPlan,
            categoryId: selectedCategory,
            paymentMethod,
            reference: paymentMethod === "upi" ? reference.trim() : undefined,
          };

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Payment failed");

      if (isSchedule) {
        onSuccess(
          `Payment recorded for ${member.name}. Due ${formatDate(dueDate!)} marked as paid. New expiry: ${formatDate(data.membership.endDate)}.`
        );
      } else {
        onSuccess(
          `Membership renewed for ${member.name}. New expiry: ${formatDate(data.membership.endDate)}. Payment ₹${data.payment.amount.toLocaleString("en-IN")} recorded.`
        );
      }
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Payment failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose} role="presentation">
      <motion.div
        className={styles.modal}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="renewal-title"
        initial={{ opacity: 0, scale: 0.96, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className={styles.accentBar} aria-hidden="true" />

        <div className={styles.modalBody}>
          <div className={styles.header}>
            <div>
              <h2 id="renewal-title" className={styles.title}>
                {isSchedule ? "Pay Membership Installment" : "Renew Membership"}
              </h2>
              <p className={styles.subtitle}>
                {isSchedule
                  ? "Complete scheduled payment without leaving this page"
                  : "Extend membership without leaving this page"}
              </p>
            </div>
            <button type="button" className={styles.closeBtn} onClick={onClose} aria-label="Close">
              ×
            </button>
          </div>

          {isSchedule && dueDate && (
            <div className={`${styles.expiryAlert} ${styles.expiryAlertWarning}`} role="alert">
              <strong>Scheduled Due Date</strong>
              {installmentNo != null && ` · Installment #${installmentNo}`} — {formatDate(dueDate)}
            </div>
          )}

          {showExpiryAlert && !isSchedule && (
            <div
              className={`${styles.expiryAlert} ${
                m?.displayStatus === "expired" ? styles.expiryAlertDanger : styles.expiryAlertWarning
              }`}
              role="alert"
            >
              {m?.displayStatus === "expired" ? (
                <>
                  <strong>Membership expired</strong> on {formatDate(m.endDate)}. Renew now to
                  restore active access.
                </>
              ) : (
                <>
                  <strong>Expiring in {m?.remainingDays} day{m?.remainingDays === 1 ? "" : "s"}</strong>{" "}
                  (by {formatDate(m?.endDate)}). Renewal is available within the last{" "}
                  {MEMBERSHIP_RENEWAL_WINDOW_DAYS} days before expiry.
                </>
              )}
            </div>
          )}

          <section className={styles.memberCard}>
            <h3 className={styles.sectionTitle}>Member Information</h3>
            <div className={styles.infoGrid}>
              <InfoItem label="Member Name" value={member.name} />
              <InfoItem label="Member ID" value={member.id} />
              <InfoItem label="Mobile Number" value={member.phone} />
              <InfoItem label="Joining Date" value={formatDate(member.joiningDate)} />
              <InfoItem label="Current Plan" value={m?.billingPlan ?? "—"} />
              <InfoItem label="Current Service" value={m?.serviceName ?? "—"} />
              <InfoItem label="Expiry Date" value={formatDate(m?.endDate)} />
              <InfoItem
                label="Remaining Days"
                value={
                  m
                    ? m.remainingDays < 0
                      ? "Expired"
                      : `${m.remainingDays} day${m.remainingDays === 1 ? "" : "s"}`
                    : "—"
                }
              />
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Membership Status</span>
                <span
                  className={`${styles.statusBadge} ${
                    m?.displayStatus === "expired"
                      ? styles.statusExpired
                      : m?.displayStatus === "expiring"
                        ? styles.statusExpiring
                        : styles.statusActive
                  }`}
                >
                  {statusLabel}
                </span>
              </div>
            </div>
          </section>

          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>Select New Membership</h3>
            <div className={styles.planGrid}>
              {MEMBERSHIP_PLANS.map((plan) => (
                <div
                  key={plan.id}
                  className={`${styles.planCard} ${selectedPlan === plan.id ? styles.planCardActive : ""}`}
                >
                  {plan.popular && <span className={styles.popular}>Most Popular</span>}
                  <div className={styles.planName}>{plan.name}</div>
                  <div className={styles.planPeriod}>{plan.period}</div>
                  <div className={styles.categories}>
                    {plan.categories.map((cat) => {
                      const selected =
                        selectedPlan === plan.id && selectedCategory === cat.id;
                      return (
                        <button
                          key={cat.id}
                          type="button"
                          className={`${styles.categoryBtn} ${selected ? styles.categorySelected : ""}`}
                          onClick={() => {
                            setSelectedPlan(plan.id);
                            setSelectedCategory(cat.id);
                            setError("");
                          }}
                        >
                          <span>{cat.name}</span>
                          <strong>₹{cat.price.toLocaleString("en-IN")}</strong>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {planSelection && (
            <motion.section
              className={styles.priceSummary}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <span>{isSchedule ? "Payment Amount" : "Renewal Amount"}</span>
              <strong>₹{planSelection.price.toLocaleString("en-IN")}</strong>
              <p>{planSelection.fullName}</p>
            </motion.section>
          )}

          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>Payment Method</h3>
            <div className={styles.paymentRow}>
              {PAYMENT_MODES.map((mode) => (
                <button
                  key={mode.id}
                  type="button"
                  className={`${styles.payOption} ${paymentMethod === mode.id ? styles.paySelected : ""}`}
                  onClick={() => setPaymentMethod(mode.id as "cash" | "upi")}
                >
                  {mode.name}
                </button>
              ))}
            </div>
            {paymentMethod === "upi" && (
              <div className={styles.field}>
                <label htmlFor="renew-ref">UPI Transaction Reference</label>
                <input
                  id="renew-ref"
                  value={reference}
                  onChange={(e) => setReference(e.target.value)}
                  placeholder="e.g. UPI-123456789"
                />
              </div>
            )}
          </section>

          {error && <p className={styles.error}>{error}</p>}

          <div className={styles.actions}>
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button
              type="button"
              variant="primary"
              onClick={handleConfirm}
              disabled={loading || !planSelection || !paymentMethod}
            >
              {loading ? "Processing…" : isSchedule ? "Confirm Payment" : "Confirm Renewal"}
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div className={styles.infoItem}>
      <span className={styles.infoLabel}>{label}</span>
      <span className={styles.infoValue}>{value}</span>
    </div>
  );
}

"use client";

import { motion } from "framer-motion";
import type { MembershipInstallment } from "@/lib/membership-schedule";
import styles from "./MembershipPaymentSchedule.module.css";

interface MembershipPaymentScheduleProps {
  installments: MembershipInstallment[];
  onPayNow: (installment: MembershipInstallment) => void;
}

function formatDate(date?: string) {
  if (!date) return "—";
  return new Date(date + "T00:00:00").toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function StatusPill({ status }: { status: MembershipInstallment["status"] }) {
  const labels = {
    paid: "Paid",
    upcoming: "Upcoming",
    overdue: "Overdue",
  };
  const classMap = {
    paid: styles.statusPaid,
    upcoming: styles.statusUpcoming,
    overdue: styles.statusOverdue,
  };
  const dots = { paid: "🟢", upcoming: "🟡", overdue: "🔴" };

  return (
    <span className={classMap[status]}>
      <span aria-hidden="true">{dots[status]}</span>
      {labels[status]}
    </span>
  );
}

export default function MembershipPaymentSchedule({
  installments,
  onPayNow,
}: MembershipPaymentScheduleProps) {
  const payable =
    installments.find((i) => i.status === "overdue") ??
    installments.find((i) => i.status === "upcoming") ??
    null;

  if (installments.length === 0) {
    return (
      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Membership Payment Schedule</h3>
        <p className={styles.empty}>No schedule available. Member joining date is required.</p>
      </section>
    );
  }

  return (
    <motion.section
      className={styles.section}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
    >
      <h3 className={styles.sectionTitle}>Membership Payment Schedule</h3>
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Installment No.</th>
              <th>Due Date</th>
              <th>Membership Plan</th>
              <th>Amount</th>
              <th>Payment Status</th>
              <th>Payment Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {installments.map((inst, index) => {
              const canPay =
                payable?.dueDate === inst.dueDate &&
                (inst.status === "overdue" || inst.status === "upcoming");

              return (
                <motion.tr
                  key={`${inst.dueDate}-${inst.installmentNo}`}
                  className={
                    inst.status === "overdue"
                      ? styles.rowOverdue
                      : inst.status === "upcoming" && canPay
                        ? styles.rowUpcoming
                        : undefined
                  }
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.03, duration: 0.3 }}
                >
                  <td>{inst.installmentNo}</td>
                  <td>{formatDate(inst.dueDate)}</td>
                  <td>{inst.billingPlan}</td>
                  <td>₹{inst.amount.toLocaleString("en-IN")}</td>
                  <td>
                    <StatusPill status={inst.status} />
                  </td>
                  <td className={styles.muted}>
                    {inst.paymentDate ? formatDate(inst.paymentDate) : "—"}
                  </td>
                  <td>
                    {canPay ? (
                      <button
                        type="button"
                        className={`${styles.payBtn} ${
                          inst.status === "overdue" ? styles.payBtnUrgent : ""
                        }`}
                        onClick={() => onPayNow(inst)}
                      >
                        Pay Now
                      </button>
                    ) : (
                      <span className={styles.muted}>—</span>
                    )}
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </motion.section>
  );
}

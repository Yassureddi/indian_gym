"use client";

import { useEffect, useState } from "react";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import { AdminTable, StatusBadge } from "@/components/admin/AdminTable";
import PaymentDetailsModal from "@/components/admin/PaymentDetailsModal";
import Button from "@/components/ui/Button";
import type { Payment } from "@/lib/admin/types";

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [selectedPaymentId, setSelectedPaymentId] = useState<string | null>(null);

  const load = () =>
    fetch("/api/admin/payments")
      .then((r) => r.json())
      .then((d) => setPayments(d.payments ?? []));

  useEffect(() => {
    load();
  }, []);

  const total = payments
    .filter((p) => p.status === "completed")
    .reduce((s, p) => s + p.amount, 0);

  return (
    <div>
      <AdminPageHeader
        title="Payments"
        description={`Total collected: ₹${total.toLocaleString("en-IN")}. Payments are recorded automatically when new members complete registration.`}
      />

      <AdminTable
        headers={["Date", "Member", "Plan", "Amount", "Method", "Status", ""]}
      >
        {payments.map((p) => (
          <tr key={p.id}>
            <td>{new Date(p.date).toLocaleDateString("en-IN")}</td>
            <td>{p.memberName}</td>
            <td>{p.planName}</td>
            <td>₹{p.amount.toLocaleString("en-IN")}</td>
            <td><StatusBadge status={p.method} /></td>
            <td><StatusBadge status={p.status} /></td>
            <td>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setSelectedPaymentId(p.id)}
              >
                View Details
              </Button>
            </td>
          </tr>
        ))}
      </AdminTable>

      <PaymentDetailsModal
        paymentId={selectedPaymentId}
        onClose={() => setSelectedPaymentId(null)}
      />
    </div>
  );
}

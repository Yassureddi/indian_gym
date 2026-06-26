"use client";

import { FormEvent, useEffect, useState } from "react";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import { AdminTable, StatusBadge } from "@/components/admin/AdminTable";
import Button from "@/components/ui/Button";
import type { Payment } from "@/lib/admin/types";
import shared from "@/components/admin/admin-shared.module.css";

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const load = () =>
    fetch("/api/admin/payments")
      .then((r) => r.json())
      .then((d) => setPayments(d.payments ?? []));

  useEffect(() => { load(); }, []);

  const total = payments
    .filter((p) => p.status === "completed")
    .reduce((s, p) => s + p.amount, 0);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    const fd = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/admin/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: "user_member_demo",
          memberName: fd.get("memberName"),
          amount: fd.get("amount"),
          method: fd.get("method"),
          status: fd.get("status"),
          planName: fd.get("planName"),
          reference: fd.get("reference"),
        }),
      });
      if (!res.ok) throw new Error((await res.json()).error);
      setMessage("Payment recorded.");
      e.currentTarget.reset();
      load();
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <AdminPageHeader
        title="Payments"
        description={`Total collected: ₹${total.toLocaleString("en-IN")}`}
      />
      {message && <p className={`${shared.alert} ${shared.alertSuccess}`}>{message}</p>}

      <div className={shared.grid2} style={{ marginBottom: "1.5rem" }}>
        <div className={shared.panel}>
          <h3 style={{ marginBottom: "1rem", fontFamily: "var(--font-heading)" }}>Record Payment</h3>
          <form onSubmit={handleSubmit} className={shared.formGrid}>
            <div className={shared.field}>
              <label>Member Name</label>
              <input name="memberName" required />
            </div>
            <div className={shared.field}>
              <label>Amount (₹)</label>
              <input name="amount" type="number" required />
            </div>
            <div className={shared.field}>
              <label>Plan</label>
              <select name="planName" required>
                <option value="Monthly">Monthly</option>
                <option value="Quarterly">Quarterly</option>
                <option value="Half Yearly">Half Yearly</option>
                <option value="Yearly">Yearly</option>
              </select>
            </div>
            <div className={shared.field}>
              <label>Method</label>
              <select name="method">
                <option value="upi">UPI</option>
                <option value="cash">Cash</option>
                <option value="card">Card</option>
              </select>
            </div>
            <div className={shared.field}>
              <label>Status</label>
              <select name="status">
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
              </select>
            </div>
            <div className={shared.field}>
              <label>Reference</label>
              <input name="reference" placeholder="UPI ref / receipt #" />
            </div>
            <div className={shared.fullWidth}>
              <Button type="submit" variant="primary" disabled={loading}>Add Payment</Button>
            </div>
          </form>
        </div>
      </div>

      <AdminTable headers={["Date", "Member", "Plan", "Amount", "Method", "Status"]}>
        {payments.map((p) => (
          <tr key={p.id}>
            <td>{new Date(p.date).toLocaleDateString("en-IN")}</td>
            <td>{p.memberName}</td>
            <td>{p.planName}</td>
            <td>₹{p.amount.toLocaleString("en-IN")}</td>
            <td><StatusBadge status={p.method} /></td>
            <td><StatusBadge status={p.status} /></td>
          </tr>
        ))}
      </AdminTable>
    </div>
  );
}

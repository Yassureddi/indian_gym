"use client";

import { useEffect, useMemo, useState } from "react";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import {
  AdminFilterBar,
  AdminPageShell,
  AdminSearchInput,
  AdminSelect,
} from "@/components/admin/AdminFilterBar";
import { AdminTable, StatusBadge } from "@/components/admin/AdminTable";
import type { SupplementOrder, SupplementOrderStatus } from "@/lib/supplements";
import { SUPPLEMENT_ORDER_STATUSES, formatOrderStatus } from "@/lib/supplements";
import shared from "@/components/admin/admin-shared.module.css";
import pageStyles from "@/components/admin/admin-supplement-pages.module.css";

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function AdminSupplementOrdersPage() {
  const [orders, setOrders] = useState<SupplementOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const load = () =>
    fetch("/api/admin/supplement-orders")
      .then((r) => r.json())
      .then((d) => {
        if (d.error) throw new Error(d.error);
        setOrders(d.orders ?? []);
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load orders"))
      .finally(() => setLoading(false));

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    return orders.filter((order) => {
      const matchStatus = statusFilter === "all" || order.status === statusFilter;
      const matchQuery =
        !q ||
        order.customerName.toLowerCase().includes(q) ||
        order.mobile.includes(q) ||
        order.productName.toLowerCase().includes(q) ||
        order.id.toLowerCase().includes(q);
      return matchStatus && matchQuery;
    });
  }, [orders, query, statusFilter]);

  const updateStatus = async (order: SupplementOrder, status: SupplementOrderStatus) => {
    setError("");
    try {
      const res = await fetch(`/api/admin/supplement-orders/${order.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Update failed");
      setOrders((prev) => prev.map((o) => (o.id === order.id ? data.order : o)));
      setMessage(`Order ${order.id} updated to ${formatOrderStatus(status)}.`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Update failed");
    }
  };

  return (
    <AdminPageShell>
      <AdminPageHeader
        title="Supplement Orders"
        description="View and manage online supplement purchase orders from the website."
      />

      {message && <p className={`${shared.alert} ${shared.alertSuccess}`}>{message}</p>}
      {error && <p className={`${shared.alert} ${shared.alertError}`}>{error}</p>}

      <AdminFilterBar>
        <AdminSearchInput
          value={query}
          onChange={setQuery}
          placeholder="Search customer, product, order ID..."
        />
        <AdminSelect value={statusFilter} onChange={setStatusFilter}>
          <option value="all">All Status</option>
          {SUPPLEMENT_ORDER_STATUSES.map((s) => (
            <option key={s.id} value={s.id}>{s.label}</option>
          ))}
        </AdminSelect>
      </AdminFilterBar>

      {loading ? (
        <p className={pageStyles.empty}>Loading orders...</p>
      ) : filtered.length === 0 ? (
        <p className={pageStyles.empty}>No supplement orders found.</p>
      ) : (
        <div className={`${shared.tableWrap} ${pageStyles.contentPanel}`}>
          <AdminTable
            headers={[
              "Order ID",
              "Customer",
              "Mobile",
              "Product",
              "Qty",
              "Total",
              "Payment",
              "Status",
              "Date",
              "Update",
            ]}
          >
            {filtered.map((order) => (
              <tr key={order.id}>
                <td style={{ fontSize: "0.75rem", color: "var(--color-text-muted)" }}>{order.id}</td>
                <td><strong>{order.customerName}</strong></td>
                <td>{order.mobile}</td>
                <td>{order.productName}</td>
                <td>{order.quantity}</td>
                <td>₹{order.totalAmount.toLocaleString("en-IN")}</td>
                <td><StatusBadge status={order.paymentMethod} /></td>
                <td>
                  <StatusBadge
                    status={
                      order.status === "delivered"
                        ? "completed"
                        : order.status === "cancelled"
                          ? "failed"
                          : "pending"
                    }
                  />
                </td>
                <td>{formatDate(order.createdAt)}</td>
                <td>
                  <select
                    value={order.status}
                    onChange={(e) => updateStatus(order, e.target.value as SupplementOrderStatus)}
                    className="admin-select"
                    disabled={order.status === "cancelled"}
                  >
                    {SUPPLEMENT_ORDER_STATUSES.map((s) => (
                      <option key={s.id} value={s.id}>{s.label}</option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </AdminTable>
        </div>
      )}
    </AdminPageShell>
  );
}

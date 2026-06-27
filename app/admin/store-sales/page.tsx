"use client";

import { useCallback, useEffect, useState } from "react";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import {
  AdminFilterBar,
  AdminPageShell,
  AdminSearchInput,
  AdminSelect,
} from "@/components/admin/AdminFilterBar";
import { AdminTable } from "@/components/admin/AdminTable";
import Button from "@/components/ui/Button";
import type { StoreSale } from "@/lib/store-pos";
import { getCustomerTypeLabel } from "@/lib/store-pos";
import { downloadStoreInvoice, printStoreInvoice } from "@/lib/store-invoice";
import shared from "@/components/admin/admin-shared.module.css";
import pageStyles from "@/components/admin/admin-supplement-pages.module.css";
import styles from "./page.module.css";

function formatDateTime(date: string) {
  return new Date(date).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function AdminStoreSalesPage() {
  const [sales, setSales] = useState<StoreSale[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [period, setPeriod] = useState("all");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const load = useCallback(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (query.trim()) params.set("q", query.trim());
    params.set("period", period);
    if (period === "custom" && from && to) {
      params.set("from", from);
      params.set("to", to);
    }

    fetch(`/api/admin/store-sales?${params}`)
      .then((r) => r.json())
      .then((d) => setSales(d.sales ?? []))
      .finally(() => setLoading(false));
  }, [query, period, from, to]);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <AdminPageShell>
      <AdminPageHeader
        title="Store Sales"
        description="View in-store POS sales history, invoices, and payment records."
      />

      <AdminFilterBar>
        <AdminSearchInput
          value={query}
          onChange={setQuery}
          placeholder="Search customer, invoice, mobile..."
        />
        <AdminSelect value={period} onChange={setPeriod}>
          <option value="all">All Time</option>
          <option value="today">Today</option>
          <option value="week">This Week</option>
          <option value="month">This Month</option>
          <option value="custom">Custom Date</option>
        </AdminSelect>
        {period === "custom" && (
          <>
            <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} className={styles.date} />
            <input type="date" value={to} onChange={(e) => setTo(e.target.value)} className={styles.date} />
          </>
        )}
        <Button type="button" variant="outline" onClick={load}>
          Apply
        </Button>
      </AdminFilterBar>

      {loading ? (
        <p className={pageStyles.empty}>Loading sales...</p>
      ) : sales.length === 0 ? (
        <p className={pageStyles.empty}>No sales found.</p>
      ) : (
        <div className={`${shared.tableWrap} ${pageStyles.contentPanel}`}>
          <AdminTable
            headers={[
              "Invoice",
              "Order ID",
              "Customer",
              "Type",
              "Products",
              "Qty",
              "Total",
              "Payment",
              "Date",
              "Sold By",
              "Actions",
            ]}
          >
            {sales.map((sale) => (
              <tr key={sale.id}>
                <td><strong>{sale.invoiceNumber}</strong></td>
                <td style={{ fontSize: "0.75rem", color: "var(--color-text-muted)" }}>{sale.id}</td>
                <td>
                  <strong>{sale.customerName}</strong>
                  <p className={pageStyles.sub}>{sale.mobile}</p>
                </td>
                <td>{getCustomerTypeLabel(sale.customerType)}</td>
                <td>{sale.items.map((i) => i.productName).join(", ")}</td>
                <td>{sale.totalItems}</td>
                <td>₹{sale.grandTotal.toLocaleString("en-IN")}</td>
                <td>{sale.paymentMethod.toUpperCase()}</td>
                <td>{formatDateTime(sale.createdAt)}</td>
                <td>{sale.soldByName}</td>
                <td>
                  <div className={styles.invoiceBtns}>
                    <button type="button" className={styles.linkBtn} onClick={() => printStoreInvoice(sale)}>
                      Print
                    </button>
                    <button type="button" className={styles.linkBtn} onClick={() => downloadStoreInvoice(sale)}>
                      Download
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </AdminTable>
        </div>
      )}
    </AdminPageShell>
  );
}

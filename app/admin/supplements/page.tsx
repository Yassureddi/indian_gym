"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import SupplementFormModal from "@/components/admin/SupplementFormModal";
import {
  AdminFilterBar,
  AdminPageShell,
  AdminSearchInput,
  AdminSelect,
} from "@/components/admin/AdminFilterBar";
import { AdminTable, StatusBadge } from "@/components/admin/AdminTable";
import Button from "@/components/ui/Button";
import type { Supplement } from "@/lib/supplements";
import {
  SUPPLEMENT_CATEGORIES,
  getCategoryLabel,
  getEffectivePrice,
  getStockStatus,
} from "@/lib/supplements";
import shared from "@/components/admin/admin-shared.module.css";
import pageStyles from "@/components/admin/admin-supplement-pages.module.css";
import styles from "./page.module.css";

interface Inventory {
  totalProducts: number;
  activeProducts: number;
  totalStock: number;
  lowStock: number;
  outOfStock: number;
}

function isOptimizableSrc(src: string) {
  return src.startsWith("http") && !src.startsWith("data:");
}

export default function AdminSupplementsPage() {
  const [supplements, setSupplements] = useState<Supplement[]>([]);
  const [inventory, setInventory] = useState<Inventory | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [status, setStatus] = useState("all");
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Supplement | null>(null);

  const load = useCallback(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (query.trim()) params.set("q", query.trim());
    if (category !== "all") params.set("category", category);
    if (status !== "all") params.set("status", status);

    return fetch(`/api/admin/supplements?${params}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.error) throw new Error(d.error);
        setSupplements(d.supplements ?? []);
        setInventory(d.inventory ?? null);
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load"))
      .finally(() => setLoading(false));
  }, [query, category, status]);

  useEffect(() => {
    load();
  }, [load]);

  const handleDelete = async (item: Supplement) => {
    if (!confirm(`Delete "${item.name}"?`)) return;
    setError("");
    try {
      const res = await fetch(`/api/admin/supplements/${item.id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Delete failed");
      setMessage(`"${item.name}" deleted.`);
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed");
    }
  };

  const toggleActive = async (item: Supplement) => {
    setError("");
    try {
      const res = await fetch(`/api/admin/supplements/${item.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !item.isActive }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Update failed");
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Update failed");
    }
  };

  const openCreate = () => {
    setEditing(null);
    setFormOpen(true);
  };

  const openEdit = (item: Supplement) => {
    setEditing(item);
    setFormOpen(true);
  };

  return (
    <AdminPageShell>
      <AdminPageHeader
        title="Supplements"
        description="Manage supplement inventory, pricing, and availability on the website."
        action={
          <div className={pageStyles.headerActions}>
            <Link href="/supplements" target="_blank" rel="noopener noreferrer" className={pageStyles.viewLink}>
              View on Website →
            </Link>
            <Button type="button" variant="primary" onClick={openCreate}>
              Add Supplement
            </Button>
          </div>
        }
      />

      {message && <p className={`${shared.alert} ${shared.alertSuccess}`}>{message}</p>}
      {error && <p className={`${shared.alert} ${shared.alertError}`}>{error}</p>}

      {inventory && (
        <div className={pageStyles.stats}>
          <div className={pageStyles.statCard}><span>Products</span><strong>{inventory.totalProducts}</strong></div>
          <div className={pageStyles.statCard}><span>Active</span><strong>{inventory.activeProducts}</strong></div>
          <div className={pageStyles.statCard}><span>Total Stock</span><strong>{inventory.totalStock}</strong></div>
          <div className={pageStyles.statCard}><span>Low Stock</span><strong>{inventory.lowStock}</strong></div>
          <div className={pageStyles.statCard}><span>Out of Stock</span><strong>{inventory.outOfStock}</strong></div>
        </div>
      )}

      <AdminFilterBar>
        <AdminSearchInput
          value={query}
          onChange={setQuery}
          placeholder="Search by name, brand..."
        />
        <AdminSelect value={category} onChange={setCategory}>
          <option value="all">All Categories</option>
          {SUPPLEMENT_CATEGORIES.map((c) => (
            <option key={c.id} value={c.id}>{c.label}</option>
          ))}
        </AdminSelect>
        <AdminSelect value={status} onChange={setStatus}>
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Disabled</option>
          <option value="low_stock">Low Stock</option>
          <option value="out_of_stock">Out of Stock</option>
        </AdminSelect>
      </AdminFilterBar>

      {loading ? (
        <p className={pageStyles.empty}>Loading supplements...</p>
      ) : supplements.length === 0 ? (
        <p className={pageStyles.empty}>No supplements found. Click Add Supplement to create one.</p>
      ) : (
        <div className={`${shared.tableWrap} ${pageStyles.contentPanel}`}>
          <AdminTable headers={["Product", "Brand", "Category", "Price", "Stock", "Status", "Actions"]}>
            {supplements.map((item) => {
              const stock = getStockStatus(item.stockQuantity);
              return (
                <tr key={item.id}>
                  <td>
                    <div className={styles.productCell}>
                      <div className={styles.thumb}>
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          sizes="48px"
                          className={styles.thumbImg}
                          unoptimized={!isOptimizableSrc(item.image)}
                        />
                      </div>
                      <div>
                        <strong>{item.name}</strong>
                        <p className={pageStyles.sub}>{item.weight} · {item.flavor}</p>
                      </div>
                    </div>
                  </td>
                  <td>{item.brand}</td>
                  <td>{getCategoryLabel(item.category)}</td>
                  <td>
                    ₹{getEffectivePrice(item).toLocaleString("en-IN")}
                    {item.discountPrice != null && item.discountPrice < item.price && (
                      <span className={styles.strike}>₹{item.price.toLocaleString("en-IN")}</span>
                    )}
                  </td>
                  <td>
                    <span className={`${styles.stock} ${styles[stock]}`}>{item.stockQuantity}</span>
                  </td>
                  <td>
                    <StatusBadge status={item.isActive ? "active" : "expired"} />
                  </td>
                  <td>
                    <div className={styles.actions}>
                      <button type="button" className={styles.actionBtn} onClick={() => openEdit(item)}>Edit</button>
                      <button type="button" className={styles.actionBtn} onClick={() => toggleActive(item)}>
                        {item.isActive ? "Disable" : "Enable"}
                      </button>
                      <button type="button" className={`${styles.actionBtn} ${styles.deleteBtn}`} onClick={() => handleDelete(item)}>
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </AdminTable>
        </div>
      )}

      <SupplementFormModal
        open={formOpen}
        supplement={editing}
        onClose={() => setFormOpen(false)}
        onSuccess={(msg) => {
          setMessage(msg);
          setError("");
          load();
        }}
      />
    </AdminPageShell>
  );
}

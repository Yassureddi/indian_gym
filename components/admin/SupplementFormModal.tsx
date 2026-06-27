"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Button from "@/components/ui/Button";
import type { Supplement } from "@/lib/supplements";
import { SUPPLEMENT_CATEGORIES } from "@/lib/supplements";
import shared from "@/components/admin/admin-shared.module.css";
import modalStyles from "./CreateMemberModal.module.css";
import styles from "./SupplementFormModal.module.css";

interface SupplementFormModalProps {
  open: boolean;
  supplement?: Supplement | null;
  onClose: () => void;
  onSuccess: (message: string) => void;
}

export default function SupplementFormModal({
  open,
  supplement,
  onClose,
  onSuccess,
}: SupplementFormModalProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const isEdit = Boolean(supplement);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [preview, setPreview] = useState("");

  useEffect(() => {
    if (!open) {
      setError("");
      setPreview("");
      setSaving(false);
      return;
    }

    setPreview(supplement?.image ?? "");
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, onClose, supplement]);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      setPreview(supplement?.image ?? "");
      return;
    }
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    const formData = new FormData(e.currentTarget);

    try {
      const url = isEdit
        ? `/api/admin/supplements/${supplement!.id}`
        : "/api/admin/supplements";
      const res = await fetch(url, {
        method: isEdit ? "PUT" : "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Save failed");

      onSuccess(
        isEdit
          ? `Supplement "${data.supplement.name}" updated successfully.`
          : `Supplement "${data.supplement.name}" added successfully.`
      );
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  if (!open) return null;

  return (
    <div className={modalStyles.overlay} onClick={onClose} role="presentation">
      <div
        className={`${modalStyles.modal} ${styles.modal}`}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="supplement-form-title"
      >
        <div className={modalStyles.accentBar} aria-hidden="true" />
        <div className={modalStyles.modalBody}>
          <div className={modalStyles.header}>
            <div>
              <h2 id="supplement-form-title" className={modalStyles.title}>
                {isEdit ? "Edit Supplement" : "Add Supplement"}
              </h2>
              <p className={modalStyles.subtitle}>
                Manage product details, pricing, and inventory.
              </p>
            </div>
            <button type="button" className={modalStyles.closeBtn} onClick={onClose} aria-label="Close">
              ×
            </button>
          </div>

          {error && <p className={modalStyles.error}>{error}</p>}

          <form onSubmit={handleSubmit} className={shared.formGrid} key={supplement?.id ?? "new"}>
            <div className={`${shared.field} ${shared.fullWidth}`}>
              <label htmlFor="sup-image">Product Image{isEdit ? " (optional)" : ""}</label>
              <input
                ref={inputRef}
                id="sup-image"
                name="image"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                required={!isEdit}
                onChange={onFileChange}
              />
            </div>

            {preview && (
              <div className={`${shared.fullWidth} ${styles.previewWrap}`}>
                <Image src={preview} alt="Preview" width={160} height={160} className={styles.preview} unoptimized />
              </div>
            )}

            <div className={shared.field}>
              <label htmlFor="sup-name">Product Name</label>
              <input id="sup-name" name="name" required defaultValue={supplement?.name} />
            </div>
            <div className={shared.field}>
              <label htmlFor="sup-brand">Brand</label>
              <input id="sup-brand" name="brand" required defaultValue={supplement?.brand} />
            </div>
            <div className={shared.field}>
              <label htmlFor="sup-category">Category</label>
              <select id="sup-category" name="category" required defaultValue={supplement?.category ?? "protein"}>
                {SUPPLEMENT_CATEGORIES.map((c) => (
                  <option key={c.id} value={c.id}>{c.label}</option>
                ))}
              </select>
            </div>
            <div className={shared.field}>
              <label htmlFor="sup-weight">Weight</label>
              <input id="sup-weight" name="weight" required placeholder="e.g. 2 kg" defaultValue={supplement?.weight} />
            </div>
            <div className={shared.field}>
              <label htmlFor="sup-flavor">Flavor</label>
              <input id="sup-flavor" name="flavor" required defaultValue={supplement?.flavor} />
            </div>
            <div className={shared.field}>
              <label htmlFor="sup-price">Price (₹)</label>
              <input id="sup-price" name="price" type="number" min={1} required defaultValue={supplement?.price} />
            </div>
            <div className={shared.field}>
              <label htmlFor="sup-discount">Discount Price (₹)</label>
              <input id="sup-discount" name="discountPrice" type="number" min={1} defaultValue={supplement?.discountPrice ?? ""} />
            </div>
            <div className={shared.field}>
              <label htmlFor="sup-stock">Stock Quantity</label>
              <input id="sup-stock" name="stockQuantity" type="number" min={0} required defaultValue={supplement?.stockQuantity ?? 0} />
            </div>
            <div className={shared.field}>
              <label htmlFor="sup-expiry">Expiry Date</label>
              <input id="sup-expiry" name="expiryDate" type="date" required defaultValue={supplement?.expiryDate?.slice(0, 10)} />
            </div>
            <div className={`${shared.field} ${shared.fullWidth}`}>
              <label htmlFor="sup-desc">Description</label>
              <textarea id="sup-desc" name="description" rows={3} required defaultValue={supplement?.description} className={styles.textarea} />
            </div>
            <div className={`${shared.field} ${shared.fullWidth}`}>
              <label htmlFor="sup-benefits">Benefits (one per line)</label>
              <textarea id="sup-benefits" name="benefits" rows={3} defaultValue={supplement?.benefits.join("\n")} className={styles.textarea} />
            </div>
            <div className={`${shared.field} ${shared.fullWidth}`}>
              <label htmlFor="sup-ingredients">Ingredients</label>
              <textarea id="sup-ingredients" name="ingredients" rows={2} required defaultValue={supplement?.ingredients} className={styles.textarea} />
            </div>
            <div className={`${shared.field} ${shared.fullWidth}`}>
              <label htmlFor="sup-usage">Usage Instructions</label>
              <textarea id="sup-usage" name="usageInstructions" rows={2} required defaultValue={supplement?.usageInstructions} className={styles.textarea} />
            </div>
            <div className={`${shared.field} ${shared.fullWidth}`}>
              <label className={styles.checkboxLabel}>
                <input type="checkbox" name="isActive" defaultChecked={supplement?.isActive !== false} />
                Available on website
              </label>
            </div>
            <div className={shared.fullWidth}>
              <Button type="submit" variant="primary" disabled={saving}>
                {saving ? "Saving..." : isEdit ? "Update Supplement" : "Add Supplement"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

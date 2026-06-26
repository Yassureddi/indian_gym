"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import Image from "next/image";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import Button from "@/components/ui/Button";
import {
  CATEGORY_LABELS,
  GALLERY_FILTERS,
  type GalleryCategory,
  type GalleryItem,
} from "@/lib/gallery";
import shared from "@/components/admin/admin-shared.module.css";
import styles from "./page.module.css";

function isRemoteSrc(src: string) {
  return src.startsWith("http");
}

export default function AdminGalleryPage() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [filter, setFilter] = useState<GalleryCategory | "all">("all");
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [preview, setPreview] = useState("");

  const load = () =>
    fetch("/api/admin/gallery")
      .then((r) => r.json())
      .then((d) => {
        if (d.error) throw new Error(d.error);
        setItems(d.items ?? []);
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load gallery"))
      .finally(() => setLoading(false));

  useEffect(() => {
    load();
  }, []);

  const filtered =
    filter === "all" ? items : items.filter((img) => img.category === filter);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setUploading(true);
    setMessage("");
    setError("");

    const form = e.currentTarget;
    const formData = new FormData(form);
    const file = formData.get("image");

    if (!file || !(file instanceof File) || file.size === 0) {
      setError("Please choose an image to upload");
      setUploading(false);
      return;
    }

    try {
      const res = await fetch("/api/admin/gallery", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");

      setMessage("Gallery image uploaded and published on the website.");
      form.reset();
      setPreview("");
      if (inputRef.current) inputRef.current.value = "";
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const togglePublish = async (item: GalleryItem) => {
    setError("");
    try {
      const res = await fetch(`/api/admin/gallery/${item.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isPublished: !item.isPublished }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Update failed");
      setItems((prev) =>
        prev.map((img) => (img.id === item.id ? { ...img, isPublished: !item.isPublished } : img))
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Update failed");
    }
  };

  const handleDelete = async (item: GalleryItem) => {
    if (!confirm(`Delete "${item.alt}" from the gallery?`)) return;
    setError("");
    try {
      const res = await fetch(`/api/admin/gallery/${item.id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Delete failed");
      setItems((prev) => prev.filter((img) => img.id !== item.id));
      setMessage("Image removed from gallery.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed");
    }
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      setPreview("");
      return;
    }
    setPreview(URL.createObjectURL(file));
  };

  return (
    <div>
      <AdminPageHeader
        title="Gallery"
        description={`Manage website gallery images. ${items.length} image${items.length === 1 ? "" : "s"} in the database.`}
      />

      {message && <p className={`${shared.alert} ${shared.alertSuccess}`}>{message}</p>}
      {error && <p className={`${shared.alert} ${shared.alertError}`}>{error}</p>}

      <div className={styles.layout}>
        <div className={`${shared.panel} ${styles.uploadPanel}`}>
          <h3 className={styles.panelTitle}>Upload Gallery Image</h3>
          <p className={styles.panelHint}>
            Uploaded images appear on the homepage gallery and the full gallery page.
          </p>

          <form onSubmit={handleSubmit} className={shared.formGrid}>
            <div className={`${shared.field} ${shared.fullWidth}`}>
              <label htmlFor="gallery-image">Image</label>
              <input
                ref={inputRef}
                id="gallery-image"
                name="image"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                required
                onChange={onFileChange}
              />
            </div>

            {preview && (
              <div className={`${shared.fullWidth} ${styles.previewWrap}`}>
                <Image
                  src={preview}
                  alt="Upload preview"
                  width={320}
                  height={200}
                  className={styles.preview}
                  unoptimized
                />
              </div>
            )}

            <div className={`${shared.field} ${shared.fullWidth}`}>
              <label htmlFor="gallery-alt">Description</label>
              <input
                id="gallery-alt"
                name="alt"
                required
                placeholder="e.g. Main training floor"
              />
            </div>

            <div className={shared.field}>
              <label htmlFor="gallery-category">Category</label>
              <select id="gallery-category" name="category" required defaultValue="gym">
                {GALLERY_FILTERS.filter((f) => f.id !== "all").map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.label}
                  </option>
                ))}
              </select>
            </div>

            <div className={shared.field}>
              <label className={styles.checkboxLabel}>
                <input type="checkbox" name="tall" />
                Tall layout
              </label>
            </div>

            <div className={`${shared.field} ${shared.fullWidth}`}>
              <label className={styles.checkboxLabel}>
                <input type="checkbox" name="isPublished" defaultChecked />
                Show on website immediately
              </label>
            </div>

            <div className={shared.fullWidth}>
              <Button type="submit" variant="primary" disabled={uploading}>
                {uploading ? "Uploading..." : "Upload to Gallery"}
              </Button>
            </div>
          </form>
        </div>

        <div className={styles.gallerySection}>
          <div className={styles.toolbar}>
            <div className={styles.filters} role="tablist" aria-label="Filter gallery">
              {GALLERY_FILTERS.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  role="tab"
                  aria-selected={filter === f.id}
                  className={`${styles.filterBtn} ${filter === f.id ? styles.filterActive : ""}`}
                  onClick={() => setFilter(f.id)}
                >
                  {f.label}
                </button>
              ))}
            </div>
            <a href="/gallery" target="_blank" rel="noopener noreferrer" className={styles.viewLink}>
              View on website →
            </a>
          </div>

          {loading ? (
            <p className={styles.loading}>Loading gallery...</p>
          ) : filtered.length === 0 ? (
            <p className={styles.empty}>No images yet. Upload your first gallery photo above.</p>
          ) : (
            <div className={shared.cardGrid}>
              {filtered.map((img) => (
                <div key={img.id} className={`${shared.panel} ${styles.card}`}>
                  <div className={styles.imageWrap}>
                    <Image
                      src={img.src}
                      alt={img.alt}
                      fill
                      sizes="300px"
                      className={styles.image}
                      unoptimized={!isRemoteSrc(img.src)}
                    />
                    <span
                      className={`${styles.status} ${
                        img.isPublished === false ? styles.statusHidden : styles.statusLive
                      }`}
                    >
                      {img.isPublished === false ? "Hidden" : "Live"}
                    </span>
                  </div>
                  <div className={styles.meta}>
                    <p className={styles.alt}>{img.alt}</p>
                    <span className={styles.cat}>{CATEGORY_LABELS[img.category]}</span>
                    <div className={styles.actions}>
                      <button
                        type="button"
                        className={styles.actionBtn}
                        onClick={() => togglePublish(img)}
                      >
                        {img.isPublished === false ? "Publish" : "Hide"}
                      </button>
                      <button
                        type="button"
                        className={`${styles.actionBtn} ${styles.deleteBtn}`}
                        onClick={() => handleDelete(img)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

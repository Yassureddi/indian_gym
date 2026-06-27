"use client";

import { useEffect, useState } from "react";
import SupplementCard from "@/components/supplements/SupplementCard";
import PurchaseModal from "@/components/supplements/PurchaseModal";
import type { Supplement } from "@/lib/supplements";
import { SUPPLEMENT_CATEGORIES } from "@/lib/supplements";
import styles from "./SupplementsClient.module.css";

export default function SupplementsClient() {
  const [supplements, setSupplements] = useState<Supplement[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("all");
  const [purchaseItem, setPurchaseItem] = useState<Supplement | null>(null);
  const [purchaseOpen, setPurchaseOpen] = useState(false);

  useEffect(() => {
    setLoading(true);
    const params = category !== "all" ? `?category=${category}` : "";
    fetch(`/api/supplements${params}`)
      .then((r) => r.json())
      .then((d) => setSupplements(d.supplements ?? []))
      .finally(() => setLoading(false));
  }, [category]);

  const handleBuyNow = (supplement: Supplement) => {
    setPurchaseItem(supplement);
    setPurchaseOpen(true);
  };

  return (
    <>
      <div className={styles.filters} role="tablist" aria-label="Filter supplements">
        <button
          type="button"
          role="tab"
          aria-selected={category === "all"}
          className={`${styles.filterBtn} ${category === "all" ? styles.filterActive : ""}`}
          onClick={() => setCategory("all")}
        >
          All
        </button>
        {SUPPLEMENT_CATEGORIES.map((c) => (
          <button
            key={c.id}
            type="button"
            role="tab"
            aria-selected={category === c.id}
            className={`${styles.filterBtn} ${category === c.id ? styles.filterActive : ""}`}
            onClick={() => setCategory(c.id)}
          >
            {c.label}
          </button>
        ))}
      </div>

      {loading ? (
        <p className={styles.empty}>Loading supplements...</p>
      ) : supplements.length === 0 ? (
        <p className={styles.empty}>No supplements available in this category.</p>
      ) : (
        <div className={styles.grid}>
          {supplements.map((supplement, index) => (
            <SupplementCard
              key={supplement.id}
              supplement={supplement}
              index={index}
              onBuyNow={handleBuyNow}
            />
          ))}
        </div>
      )}

      <PurchaseModal
        supplement={purchaseItem}
        open={purchaseOpen}
        onClose={() => setPurchaseOpen(false)}
      />
    </>
  );
}

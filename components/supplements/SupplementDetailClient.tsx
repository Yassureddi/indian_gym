"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import Button from "@/components/ui/Button";
import PurchaseModal from "@/components/supplements/PurchaseModal";
import type { Supplement } from "@/lib/supplements";
import {
  getCategoryLabel,
  getEffectivePrice,
  getStockStatus,
} from "@/lib/supplements";
import styles from "./SupplementDetailClient.module.css";

function isOptimizableSrc(src: string) {
  return src.startsWith("http") && !src.startsWith("data:");
}

export default function SupplementDetailClient({ id }: { id: string }) {
  const [supplement, setSupplement] = useState<Supplement | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [purchaseOpen, setPurchaseOpen] = useState(false);

  useEffect(() => {
    fetch(`/api/supplements/${id}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.error) throw new Error(d.error);
        setSupplement(d.supplement);
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Not found"))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p className={styles.empty}>Loading product...</p>;
  if (error || !supplement) {
    return (
      <div className={styles.empty}>
        <p>{error || "Product not found"}</p>
        <Button href="/supplements" variant="outline">Back to Supplements</Button>
      </div>
    );
  }

  const price = getEffectivePrice(supplement);
  const stock = getStockStatus(supplement.stockQuantity);
  const hasDiscount =
    supplement.discountPrice != null && supplement.discountPrice < supplement.price;

  return (
    <>
      <motion.div
        className={styles.layout}
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className={styles.gallery}>
          <div className={styles.mainImage}>
            <Image
              src={supplement.image}
              alt={supplement.name}
              fill
              sizes="(max-width: 900px) 100vw, 50vw"
              priority
              unoptimized={!isOptimizableSrc(supplement.image)}
            />
          </div>
        </div>

        <div className={styles.info}>
          <Link href="/supplements" className={styles.back}>← Back to Supplements</Link>
          <span className={styles.category}>{getCategoryLabel(supplement.category)}</span>
          <h1 className={styles.name}>{supplement.name}</h1>
          <p className={styles.brand}>{supplement.brand}</p>

          <div className={styles.meta}>
            <span><strong>Weight:</strong> {supplement.weight}</span>
            <span><strong>Flavor:</strong> {supplement.flavor}</span>
            <span className={`${styles.stock} ${styles[stock]}`}>
              {stock === "out_of_stock" ? "Out of Stock" : stock === "low_stock" ? "Low Stock" : "In Stock"} ({supplement.stockQuantity})
            </span>
          </div>

          <div className={styles.priceRow}>
            <span className={styles.price}>₹{price.toLocaleString("en-IN")}</span>
            {hasDiscount && (
              <span className={styles.original}>₹{supplement.price.toLocaleString("en-IN")}</span>
            )}
          </div>

          <p className={styles.description}>{supplement.description}</p>

          <div className={styles.actions}>
            <Button
              type="button"
              variant="primary"
              size="lg"
              disabled={stock === "out_of_stock"}
              onClick={() => setPurchaseOpen(true)}
            >
              Buy Now
            </Button>
          </div>

          {supplement.benefits.length > 0 && (
            <section className={styles.block}>
              <h2>Benefits</h2>
              <ul>
                {supplement.benefits.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
            </section>
          )}

          <section className={styles.block}>
            <h2>Ingredients</h2>
            <p>{supplement.ingredients}</p>
          </section>

          <section className={styles.block}>
            <h2>Usage Instructions</h2>
            <p>{supplement.usageInstructions}</p>
          </section>

          <p className={styles.expiry}>
            Expiry Date: {new Date(supplement.expiryDate).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>
      </motion.div>

      <PurchaseModal
        supplement={supplement}
        open={purchaseOpen}
        onClose={() => setPurchaseOpen(false)}
      />
    </>
  );
}

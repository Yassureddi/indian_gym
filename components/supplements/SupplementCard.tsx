"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import Button from "@/components/ui/Button";
import type { Supplement } from "@/lib/supplements";
import {
  getCategoryLabel,
  getEffectivePrice,
  getStockStatus,
} from "@/lib/supplements";
import styles from "./SupplementCard.module.css";

interface SupplementCardProps {
  supplement: Supplement;
  index: number;
  onBuyNow: (supplement: Supplement) => void;
}

function isOptimizableSrc(src: string) {
  return src.startsWith("http") && !src.startsWith("data:");
}

function stockLabel(status: ReturnType<typeof getStockStatus>) {
  switch (status) {
    case "in_stock":
      return "In Stock";
    case "low_stock":
      return "Low Stock";
    default:
      return "Out of Stock";
  }
}

export default function SupplementCard({ supplement, index, onBuyNow }: SupplementCardProps) {
  const stock = getStockStatus(supplement.stockQuantity);
  const price = getEffectivePrice(supplement);
  const hasDiscount =
    supplement.discountPrice != null && supplement.discountPrice < supplement.price;

  return (
    <motion.article
      className={styles.card}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      whileHover={{ y: -8 }}
    >
      <div className={styles.imageWrap}>
        <Image
          src={supplement.image}
          alt={supplement.name}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className={styles.image}
          unoptimized={!isOptimizableSrc(supplement.image)}
        />
        <span className={`${styles.stockBadge} ${styles[stock]}`}>
          {stockLabel(stock)}
        </span>
      </div>

      <div className={styles.body}>
        <span className={styles.category}>{getCategoryLabel(supplement.category)}</span>
        <h3 className={styles.name}>{supplement.name}</h3>
        <p className={styles.brand}>{supplement.brand}</p>

        <div className={styles.priceRow}>
          <span className={styles.price}>₹{price.toLocaleString("en-IN")}</span>
          {hasDiscount && (
            <span className={styles.original}>₹{supplement.price.toLocaleString("en-IN")}</span>
          )}
        </div>

        <div className={styles.actions}>
          <Button href={`/supplements/${supplement.id}`} variant="outline" size="sm">
            View Details
          </Button>
          <Button
            type="button"
            variant="primary"
            size="sm"
            disabled={stock === "out_of_stock"}
            onClick={() => onBuyNow(supplement)}
          >
            Buy Now
          </Button>
        </div>
      </div>
    </motion.article>
  );
}

"use client";

import { FormEvent, useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import Button from "@/components/ui/Button";
import type { Supplement, SupplementOrder } from "@/lib/supplements";
import { getEffectivePrice } from "@/lib/supplements";
import styles from "./PurchaseModal.module.css";

interface PurchaseModalProps {
  supplement: Supplement | null;
  open: boolean;
  onClose: () => void;
}

function isOptimizableSrc(src: string) {
  return src.startsWith("http") && !src.startsWith("data:");
}

export default function PurchaseModal({ supplement, open, onClose }: PurchaseModalProps) {
  const [quantity, setQuantity] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "upi" | null>(null);
  const [reference, setReference] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [order, setOrder] = useState<SupplementOrder | null>(null);

  useEffect(() => {
    if (!open) return;
    setQuantity(1);
    setPaymentMethod(null);
    setReference("");
    setError("");
    setOrder(null);
    setLoading(false);

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, onClose, supplement?.id]);

  if (!open || !supplement) return null;

  const unitPrice = getEffectivePrice(supplement);
  const total = unitPrice * quantity;
  const maxQty = Math.max(1, supplement.stockQuantity);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!paymentMethod) {
      setError("Please select a payment method.");
      return;
    }
    if (paymentMethod === "upi" && !reference.trim()) {
      setError("UPI transaction reference is required.");
      return;
    }

    setLoading(true);
    setError("");
    const formData = new FormData(e.currentTarget);

    try {
      const res = await fetch("/api/supplements/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          supplementId: supplement.id,
          customerName: formData.get("customerName"),
          mobile: formData.get("mobile"),
          address: formData.get("address"),
          city: formData.get("city"),
          state: formData.get("state"),
          pincode: formData.get("pincode"),
          quantity,
          paymentMethod,
          paymentReference: paymentMethod === "upi" ? reference.trim() : undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Purchase failed");
      setOrder(data.order);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Purchase failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose} role="presentation">
      <motion.div
        className={styles.modal}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        initial={{ opacity: 0, scale: 0.96, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className={styles.accentBar} aria-hidden="true" />
        <button type="button" className={styles.closeBtn} onClick={onClose} aria-label="Close">×</button>

        <AnimatePresence mode="wait">
          {order ? (
            <motion.div
              key="success"
              className={styles.success}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className={styles.successIcon}>✓</div>
              <h2>Purchase Successful!</h2>
              <p>Thank you for your order. We&apos;ll process it shortly.</p>
              <div className={styles.orderBox}>
                <div className={styles.orderRow}><span>Order ID</span><strong>{order.id}</strong></div>
                <div className={styles.orderRow}><span>Product</span><strong>{order.productName}</strong></div>
                <div className={styles.orderRow}><span>Quantity</span><strong>{order.quantity}</strong></div>
                <div className={styles.orderRow}><span>Total Paid</span><strong>₹{order.totalAmount.toLocaleString("en-IN")}</strong></div>
                <div className={styles.orderRow}><span>Payment</span><strong>{order.paymentMethod.toUpperCase()}</strong></div>
              </div>
              <Button type="button" variant="primary" onClick={onClose}>Done</Button>
            </motion.div>
          ) : (
            <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={styles.content}>
              <h2 className={styles.title}>Complete Purchase</h2>

              <div className={styles.productSummary}>
                <div className={styles.productImage}>
                  <Image
                    src={supplement.image}
                    alt={supplement.name}
                    fill
                    sizes="80px"
                    unoptimized={!isOptimizableSrc(supplement.image)}
                  />
                </div>
                <div>
                  <h3>{supplement.name}</h3>
                  <p>{supplement.brand} · {supplement.weight}</p>
                  <p className={styles.unitPrice}>₹{unitPrice.toLocaleString("en-IN")} each</p>
                </div>
              </div>

              {error && <p className={styles.error}>{error}</p>}

              <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.grid}>
                  <div className={styles.field}>
                    <label htmlFor="customerName">Customer Name</label>
                    <input id="customerName" name="customerName" required />
                  </div>
                  <div className={styles.field}>
                    <label htmlFor="mobile">Mobile Number</label>
                    <input id="mobile" name="mobile" type="tel" required />
                  </div>
                  <div className={`${styles.field} ${styles.full}`}>
                    <label htmlFor="address">Delivery Address</label>
                    <input id="address" name="address" required />
                  </div>
                  <div className={styles.field}>
                    <label htmlFor="city">City</label>
                    <input id="city" name="city" required />
                  </div>
                  <div className={styles.field}>
                    <label htmlFor="state">State</label>
                    <input id="state" name="state" required />
                  </div>
                  <div className={styles.field}>
                    <label htmlFor="pincode">Pincode</label>
                    <input id="pincode" name="pincode" required minLength={6} maxLength={6} />
                  </div>
                  <div className={styles.field}>
                    <label htmlFor="quantity">Quantity</label>
                    <input
                      id="quantity"
                      type="number"
                      min={1}
                      max={maxQty}
                      value={quantity}
                      onChange={(e) => setQuantity(Math.min(maxQty, Math.max(1, Number(e.target.value))))}
                    />
                  </div>
                </div>

                <div className={styles.totalRow}>
                  <span>Total Price</span>
                  <strong>₹{total.toLocaleString("en-IN")}</strong>
                </div>

                <p className={styles.paymentLabel}>Payment Method</p>
                <div className={styles.paymentMethods}>
                  {(["cash", "upi"] as const).map((method) => (
                    <button
                      key={method}
                      type="button"
                      className={`${styles.paymentOption} ${paymentMethod === method ? styles.paymentSelected : ""}`}
                      onClick={() => setPaymentMethod(method)}
                    >
                      {method.toUpperCase()}
                    </button>
                  ))}
                </div>

                {paymentMethod === "upi" && (
                  <div className={styles.field}>
                    <label htmlFor="reference">UPI Transaction Reference</label>
                    <input
                      id="reference"
                      value={reference}
                      onChange={(e) => setReference(e.target.value)}
                      placeholder="e.g. UPI-123456789"
                      required
                    />
                  </div>
                )}

                <Button type="submit" variant="primary" size="lg" disabled={loading} className={styles.submitBtn}>
                  {loading ? "Processing..." : "Confirm Purchase"}
                </Button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

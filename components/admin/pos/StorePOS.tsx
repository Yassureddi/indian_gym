"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import Button from "@/components/ui/Button";
import type { Supplement } from "@/lib/supplements";
import {
  SUPPLEMENT_CATEGORIES,
  getCategoryLabel,
  getEffectivePrice,
} from "@/lib/supplements";
import type { CartLine, StoreSale } from "@/lib/store-pos";
import type { SessionUser } from "@/lib/auth/types";
import { downloadStoreInvoice, printStoreInvoice } from "@/lib/store-invoice";
import styles from "./StorePOS.module.css";

function isOptimizableSrc(src: string) {
  return src.startsWith("http") && !src.startsWith("data:");
}

type CustomerMode = "member" | "walk_in";
type CheckoutStep = "cart" | "customer" | "payment" | "success";

export default function StorePOS() {
  const [products, setProducts] = useState<Supplement[]>([]);
  const [members, setMembers] = useState<SessionUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [brand, setBrand] = useState("all");
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [cart, setCart] = useState<CartLine[]>([]);
  const [step, setStep] = useState<CheckoutStep>("cart");
  const [customerMode, setCustomerMode] = useState<CustomerMode>("walk_in");
  const [memberSearch, setMemberSearch] = useState("");
  const [selectedMember, setSelectedMember] = useState<SessionUser | null>(null);
  const [walkInName, setWalkInName] = useState("");
  const [walkInMobile, setWalkInMobile] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "upi" | null>(null);
  const [amountReceived, setAmountReceived] = useState("");
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");
  const [completedSale, setCompletedSale] = useState<StoreSale | null>(null);

  const loadProducts = useCallback(() => {
    fetch("/api/admin/store/products")
      .then((r) => r.json())
      .then((d) => setProducts(d.products ?? []))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    loadProducts();
    fetch("/api/admin/members")
      .then((r) => r.json())
      .then((d) => setMembers(d.members ?? []));
  }, [loadProducts]);

  const brands = useMemo(() => {
    const set = new Set(products.map((p) => p.brand));
    return Array.from(set).sort();
  }, [products]);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const q = search.toLowerCase();
      const matchSearch =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q);
      const matchCat = category === "all" || p.category === category;
      const matchBrand = brand === "all" || p.brand === brand;
      return matchSearch && matchCat && matchBrand;
    });
  }, [products, search, category, brand]);

  const filteredMembers = useMemo(() => {
    const q = memberSearch.toLowerCase().trim();
    if (!q) return members.slice(0, 8);
    return members
      .filter(
        (m) =>
          m.name.toLowerCase().includes(q) ||
          m.phone.includes(q) ||
          m.id.toLowerCase().includes(q)
      )
      .slice(0, 8);
  }, [members, memberSearch]);

  const totalItems = cart.reduce((sum, line) => sum + line.quantity, 0);
  const grandTotal = cart.reduce((sum, line) => sum + line.unitPrice * line.quantity, 0);
  const receivedNum = Number(amountReceived) || 0;
  const changeDue = paymentMethod === "cash" ? Math.max(0, receivedNum - grandTotal) : 0;

  const getQty = (id: string) => quantities[id] ?? 1;

  const setQty = (id: string, qty: number) => {
    setQuantities((prev) => ({ ...prev, [id]: Math.max(1, qty) }));
  };

  const addToCart = (product: Supplement) => {
    if (product.stockQuantity <= 0) return;
    const qty = Math.min(getQty(product.id), product.stockQuantity);
    const unitPrice = getEffectivePrice(product);

    setCart((prev) => {
      const existing = prev.find((l) => l.supplementId === product.id);
      if (existing) {
        const newQty = Math.min(existing.quantity + qty, product.stockQuantity);
        return prev.map((l) =>
          l.supplementId === product.id ? { ...l, quantity: newQty } : l
        );
      }
      return [
        ...prev,
        {
          supplementId: product.id,
          name: product.name,
          brand: product.brand,
          image: product.image,
          unitPrice,
          stock: product.stockQuantity,
          quantity: qty,
        },
      ];
    });
    setQuantities((prev) => ({ ...prev, [product.id]: 1 }));
  };

  const updateCartQty = (supplementId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((line) => {
          if (line.supplementId !== supplementId) return line;
          const product = products.find((p) => p.id === supplementId);
          const max = product?.stockQuantity ?? line.stock;
          return { ...line, quantity: Math.min(max, Math.max(1, line.quantity + delta)) };
        })
        .filter((line) => line.quantity > 0)
    );
  };

  const removeFromCart = (supplementId: string) => {
    setCart((prev) => prev.filter((l) => l.supplementId !== supplementId));
  };

  const resetCheckout = () => {
    setCart([]);
    setStep("cart");
    setCustomerMode("walk_in");
    setSelectedMember(null);
    setMemberSearch("");
    setWalkInName("");
    setWalkInMobile("");
    setPaymentMethod(null);
    setAmountReceived("");
    setError("");
    setCompletedSale(null);
    loadProducts();
  };

  const handleCompleteSale = async () => {
    if (!paymentMethod) {
      setError("Select a payment method");
      return;
    }
    if (paymentMethod === "cash" && receivedNum < grandTotal) {
      setError("Amount received must cover the total");
      return;
    }

    const customerName =
      customerMode === "member" ? selectedMember?.name ?? "" : walkInName.trim();
    const mobile =
      customerMode === "member" ? selectedMember?.phone ?? "" : walkInMobile.trim();

    if (!customerName || !mobile) {
      setError("Customer details are required");
      return;
    }

    setProcessing(true);
    setError("");
    try {
      const res = await fetch("/api/admin/store/sales", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cart.map((l) => ({
            supplementId: l.supplementId,
            quantity: l.quantity,
          })),
          customerType: customerMode,
          memberId: customerMode === "member" ? selectedMember?.id : undefined,
          customerName,
          mobile,
          paymentMethod,
          amountReceived: paymentMethod === "cash" ? receivedNum : undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Sale failed");
      setCompletedSale(data.sale);
      setStep("success");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sale failed");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className={styles.pos}>
      <div className={styles.productsPane}>
        <div className={styles.toolbar}>
          <input
            type="search"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={styles.search}
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className={`admin-select ${styles.select}`}
          >
            <option value="all">All Categories</option>
            {SUPPLEMENT_CATEGORIES.map((c) => (
              <option key={c.id} value={c.id}>{c.label}</option>
            ))}
          </select>
          <select
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            className={`admin-select ${styles.select}`}
          >
            <option value="all">All Brands</option>
            {brands.map((b) => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>
        </div>

        {loading ? (
          <p className={styles.empty}>Loading products...</p>
        ) : filtered.length === 0 ? (
          <p className={styles.empty}>No products match your filters.</p>
        ) : (
          <div className={styles.productGrid}>
            {filtered.map((product, index) => {
              const price = getEffectivePrice(product);
              const outOfStock = product.stockQuantity <= 0;
              return (
                <motion.div
                  key={product.id}
                  className={`${styles.productCard} ${outOfStock ? styles.outOfStock : ""}`}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03 }}
                >
                  <div className={styles.productImage}>
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      sizes="180px"
                      unoptimized={!isOptimizableSrc(product.image)}
                    />
                  </div>
                  <div className={styles.productBody}>
                    <span className={styles.productCat}>{getCategoryLabel(product.category)}</span>
                    <h3>{product.name}</h3>
                    <p className={styles.productBrand}>{product.brand}</p>
                    <div className={styles.productMeta}>
                      <span className={styles.productPrice}>₹{price.toLocaleString("en-IN")}</span>
                      <span className={outOfStock ? styles.stockOut : styles.stockOk}>
                        Stock: {product.stockQuantity}
                      </span>
                    </div>
                    <div className={styles.qtyRow}>
                      <button type="button" onClick={() => setQty(product.id, getQty(product.id) - 1)} disabled={outOfStock}>−</button>
                      <span>{getQty(product.id)}</span>
                      <button
                        type="button"
                        onClick={() => setQty(product.id, Math.min(product.stockQuantity, getQty(product.id) + 1))}
                        disabled={outOfStock}
                      >
                        +
                      </button>
                    </div>
                    <Button
                      type="button"
                      variant="primary"
                      size="sm"
                      disabled={outOfStock}
                      onClick={() => addToCart(product)}
                      className={styles.addBtn}
                    >
                      Add to Cart
                    </Button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      <aside className={styles.cartPane}>
        <AnimatePresence mode="wait">
          {step === "success" && completedSale ? (
            <motion.div key="success" className={styles.checkoutPanel} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className={styles.successIcon}>✓</div>
              <h2>Sale Complete!</h2>
              <p className={styles.successSub}>Invoice {completedSale.invoiceNumber}</p>
              <div className={styles.successMeta}>
                <div><span>Order ID</span><strong>{completedSale.id}</strong></div>
                <div><span>Total</span><strong>₹{completedSale.grandTotal.toLocaleString("en-IN")}</strong></div>
                <div><span>Customer</span><strong>{completedSale.customerName}</strong></div>
              </div>
              <div className={styles.invoiceActions}>
                <Button type="button" variant="outline" onClick={() => printStoreInvoice(completedSale)}>
                  Print Invoice
                </Button>
                <Button type="button" variant="primary" onClick={() => downloadStoreInvoice(completedSale)}>
                  Download Invoice
                </Button>
              </div>
              <Button type="button" variant="primary" onClick={resetCheckout} className={styles.newSaleBtn}>
                New Sale
              </Button>
            </motion.div>
          ) : step === "payment" ? (
            <motion.div key="payment" className={styles.checkoutPanel} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
              <button type="button" className={styles.backBtn} onClick={() => setStep("customer")}>← Back</button>
              <h2>Payment</h2>
              <div className={styles.payTotal}>
                <span>Total Amount</span>
                <strong>₹{grandTotal.toLocaleString("en-IN")}</strong>
              </div>
              <div className={styles.payMethods}>
                {(["cash", "upi"] as const).map((m) => (
                  <button
                    key={m}
                    type="button"
                    className={`${styles.payBtn} ${paymentMethod === m ? styles.paySelected : ""}`}
                    onClick={() => setPaymentMethod(m)}
                  >
                    {m.toUpperCase()}
                  </button>
                ))}
              </div>
              {paymentMethod === "cash" && (
                <>
                  <div className={styles.field}>
                    <label>Amount Received (₹)</label>
                    <input
                      type="number"
                      min={0}
                      value={amountReceived}
                      onChange={(e) => setAmountReceived(e.target.value)}
                    />
                  </div>
                  <div className={styles.changeRow}>
                    <span>Balance to Return</span>
                    <strong>₹{changeDue.toLocaleString("en-IN")}</strong>
                  </div>
                </>
              )}
              {paymentMethod === "upi" && (
                <p className={styles.upiNote}>Mark payment as successful after UPI confirmation.</p>
              )}
              {error && <p className={styles.error}>{error}</p>}
              <Button
                type="button"
                variant="primary"
                size="lg"
                disabled={processing || !paymentMethod || (paymentMethod === "cash" && receivedNum < grandTotal)}
                onClick={handleCompleteSale}
                className={styles.completeBtn}
              >
                {processing ? "Processing..." : "Complete Sale"}
              </Button>
            </motion.div>
          ) : step === "customer" ? (
            <motion.div key="customer" className={styles.checkoutPanel} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
              <button type="button" className={styles.backBtn} onClick={() => setStep("cart")}>← Back</button>
              <h2>Customer</h2>
              <div className={styles.customerTabs}>
                <button
                  type="button"
                  className={customerMode === "member" ? styles.tabActive : ""}
                  onClick={() => setCustomerMode("member")}
                >
                  Member
                </button>
                <button
                  type="button"
                  className={customerMode === "walk_in" ? styles.tabActive : ""}
                  onClick={() => setCustomerMode("walk_in")}
                >
                  Walk-in
                </button>
              </div>
              {customerMode === "member" ? (
                <>
                  <input
                    type="search"
                    placeholder="Search member..."
                    value={memberSearch}
                    onChange={(e) => setMemberSearch(e.target.value)}
                    className={styles.search}
                  />
                  <div className={styles.memberList}>
                    {filteredMembers.map((m) => (
                      <button
                        key={m.id}
                        type="button"
                        className={`${styles.memberOption} ${selectedMember?.id === m.id ? styles.memberSelected : ""}`}
                        onClick={() => setSelectedMember(m)}
                      >
                        <strong>{m.name}</strong>
                        <span>{m.phone} · {m.id}</span>
                      </button>
                    ))}
                  </div>
                  {selectedMember && (
                    <div className={styles.selectedMember}>
                      <p><strong>{selectedMember.name}</strong></p>
                      <p>{selectedMember.phone}</p>
                      <p className={styles.memberId}>{selectedMember.id}</p>
                    </div>
                  )}
                </>
              ) : (
                <>
                  <div className={styles.field}>
                    <label>Customer Name</label>
                    <input value={walkInName} onChange={(e) => setWalkInName(e.target.value)} />
                  </div>
                  <div className={styles.field}>
                    <label>Mobile Number</label>
                    <input value={walkInMobile} onChange={(e) => setWalkInMobile(e.target.value)} type="tel" />
                  </div>
                </>
              )}
              <Button
                type="button"
                variant="primary"
                disabled={customerMode === "member" ? !selectedMember : !walkInName.trim() || !walkInMobile.trim()}
                onClick={() => { setError(""); setStep("payment"); }}
                className={styles.completeBtn}
              >
                Continue to Payment
              </Button>
            </motion.div>
          ) : (
            <motion.div key="cart" className={styles.cartPanel} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className={styles.cartHeader}>
                <h2>Cart</h2>
                <span className={styles.cartCount}>{totalItems} items</span>
              </div>

              {cart.length === 0 ? (
                <p className={styles.cartEmpty}>Cart is empty. Add products from the left.</p>
              ) : (
                <ul className={styles.cartList}>
                  {cart.map((line) => (
                    <li key={line.supplementId} className={styles.cartItem}>
                      <div className={styles.cartThumb}>
                        <Image src={line.image} alt={line.name} fill sizes="48px" unoptimized={!isOptimizableSrc(line.image)} />
                      </div>
                      <div className={styles.cartInfo}>
                        <strong>{line.name}</strong>
                        <span>₹{line.unitPrice.toLocaleString("en-IN")} each</span>
                        <div className={styles.cartQty}>
                          <button type="button" onClick={() => updateCartQty(line.supplementId, -1)}>−</button>
                          <span>{line.quantity}</span>
                          <button type="button" onClick={() => updateCartQty(line.supplementId, 1)}>+</button>
                        </div>
                      </div>
                      <div className={styles.cartRight}>
                        <strong>₹{(line.unitPrice * line.quantity).toLocaleString("en-IN")}</strong>
                        <button type="button" className={styles.removeBtn} onClick={() => removeFromCart(line.supplementId)}>×</button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}

              <div className={styles.summary}>
                <div><span>Total Items</span><strong>{totalItems}</strong></div>
                <div className={styles.grandTotal}><span>Grand Total</span><strong>₹{grandTotal.toLocaleString("en-IN")}</strong></div>
              </div>

              <Button
                type="button"
                variant="primary"
                size="lg"
                disabled={cart.length === 0}
                onClick={() => setStep("customer")}
                className={styles.checkoutBtn}
              >
                Checkout
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </aside>
    </div>
  );
}

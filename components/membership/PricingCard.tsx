"use client";

import { motion } from "framer-motion";
import { MembershipPlan } from "@/lib/membership";
import { formatPrice } from "@/lib/utils";
import Button from "@/components/ui/Button";
import styles from "./PricingCard.module.css";

interface PricingCardProps {
  plan: MembershipPlan;
  index: number;
}

export default function PricingCard({ plan, index }: PricingCardProps) {
  return (
    <motion.article
      className={`${styles.card} ${plan.popular ? styles.popular : ""}`}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.55, delay: index * 0.1, ease: [0.25, 0.1, 0.25, 1] }}
      whileHover={{ y: plan.popular ? -10 : -6 }}
    >
      {plan.popular && <span className={styles.badge}>Most Popular</span>}

      <div className={styles.header}>
        <h3 className={styles.name}>{plan.name}</h3>
        {plan.savings && <span className={styles.savings}>{plan.savings}</span>}
      </div>

      <div className={styles.pricing}>
        <div className={styles.priceRow}>
          <span className={styles.currency}>₹</span>
          <span className={styles.amount}>
            {plan.price.toLocaleString("en-IN")}
          </span>
        </div>
        <span className={styles.period}>{plan.period}</span>
        {plan.originalPrice && (
          <span className={styles.original}>
            {formatPrice(plan.originalPrice)}
          </span>
        )}
      </div>

      <div className={styles.divider} aria-hidden="true" />

      <ul className={styles.features}>
        {plan.features.map((feature) => (
          <li key={feature}>
            <span className={styles.check} aria-hidden="true">
              <CheckIcon />
            </span>
            {feature}
          </li>
        ))}
      </ul>

      <Button
        href="/free-trial"
        variant={plan.popular ? "primary" : "outline"}
        size="lg"
        className={styles.cta}
      >
        Join Now
      </Button>

      <div className={styles.shine} aria-hidden="true" />
    </motion.article>
  );
}

function CheckIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
    </svg>
  );
}

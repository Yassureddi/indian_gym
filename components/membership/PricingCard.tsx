"use client";

import { motion } from "framer-motion";
import type { MembershipPlan } from "@/lib/membership";
import Button from "@/components/ui/Button";
import styles from "./PricingCard.module.css";

interface PricingCardProps {
  plan: MembershipPlan;
  index: number;
  showCta?: boolean;
  animated?: boolean;
}

export default function PricingCard({
  plan,
  index,
  showCta = true,
  animated = true,
}: PricingCardProps) {
  const CardWrapper = animated ? motion.article : "article";
  const motionProps = animated
    ? {
        initial: { opacity: 0, y: 50 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, margin: "-40px" },
        transition: { duration: 0.55, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] },
        whileHover: { y: plan.popular ? -10 : -6, scale: 1.02 },
        style: { willChange: "transform" },
      }
    : {};

  return (
    <CardWrapper
      className={`${styles.card} ${plan.popular ? styles.popular : ""}`}
      {...motionProps}
    >
      {plan.popular && <span className={styles.badge}>Most Popular</span>}

      <div className={styles.header}>
        <h3 className={styles.name}>{plan.name}</h3>
        <span className={styles.periodLabel}>{plan.period}</span>
      </div>

      <div className={styles.categories}>
        {plan.categories.map((category) => (
          <div key={category.id} className={styles.categoryBlock}>
            <div className={styles.categoryHeader}>
              <h4 className={styles.categoryName}>{category.name}</h4>
              <div className={styles.categoryPrice}>
                <span className={styles.currency}>₹</span>
                <span className={styles.amount}>
                  {category.price.toLocaleString("en-IN")}
                </span>
              </div>
            </div>
            <ul className={styles.features}>
              {category.features.map((feature) => (
                <li key={feature}>
                  <span className={styles.check} aria-hidden="true">
                    <CheckIcon />
                  </span>
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {showCta && (
        <Button
          href="/free-trial"
          variant={plan.popular ? "primary" : "outline"}
          size="lg"
          className={styles.cta}
        >
          Join Now
        </Button>
      )}

      <div className={styles.shine} aria-hidden="true" />
    </CardWrapper>
  );
}

function CheckIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
    </svg>
  );
}

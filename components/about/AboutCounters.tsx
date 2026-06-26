"use client";

import { useRef } from "react";
import AnimatedCounter from "@/components/animations/AnimatedCounter";
import { ABOUT_COUNTERS } from "@/lib/about";
import styles from "./AboutCounters.module.css";

export default function AboutCounters() {
  const sectionRef = useRef<HTMLElement>(null);

  return (
    <section ref={sectionRef} className={styles.section}>
      <div className={`${styles.glow} premium-glow-pulse`} aria-hidden="true" />
      <div className="container">
        <div className={styles.header}>
          <span className={styles.label}>By The Numbers</span>
          <h2 className={styles.title}>Our Impact</h2>
        </div>
        <div className={styles.grid}>
          {ABOUT_COUNTERS.map((stat) => (
            <div key={stat.label} className={`${styles.item} premium-scale-hover`}>
              <AnimatedCounter
                value={stat.value}
                suffix={stat.suffix}
                triggerRef={sectionRef}
                className={styles.value}
              />
              <span className={styles.statLabel}>{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

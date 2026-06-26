"use client";

import { useRef } from "react";
import AnimatedCounter from "@/components/animations/AnimatedCounter";
import SectionHeading from "@/components/ui/SectionHeading";
import { TRANSFORMATION_STATS } from "@/lib/constants";
import styles from "./TransformationCounter.module.css";

export default function TransformationCounter() {
  const sectionRef = useRef<HTMLElement>(null);

  return (
    <section ref={sectionRef} className={styles.section} id="transformations">
      <div className={`${styles.bgGlow} premium-glow-pulse`} aria-hidden="true" />
      <div className="container">
        <SectionHeading
          subtitle="Real Results"
          title="Transformation Counter"
          description="Numbers that speak louder than words. Join our legacy of success."
        />
        <div className={styles.grid}>
          {TRANSFORMATION_STATS.map((stat) => (
            <div key={stat.label} className={`${styles.item} premium-scale-hover`}>
              <AnimatedCounter
                value={stat.value}
                suffix={stat.suffix}
                triggerRef={sectionRef}
                className={styles.value}
              />
              <span className={styles.label}>{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

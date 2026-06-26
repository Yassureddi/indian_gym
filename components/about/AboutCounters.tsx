"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ABOUT_COUNTERS } from "@/lib/about";
import styles from "./AboutCounters.module.css";

gsap.registerPlugin(ScrollTrigger);

export default function AboutCounters() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const counters = section.querySelectorAll("[data-count]");

    counters.forEach((counter) => {
      const target = parseInt(counter.getAttribute("data-count") || "0", 10);

      gsap.fromTo(
        counter,
        { innerText: 0 },
        {
          innerText: target,
          duration: 2.2,
          ease: "power2.out",
          snap: { innerText: 1 },
          scrollTrigger: {
            trigger: section,
            start: "top 75%",
            toggleActions: "play none none none",
          },
        }
      );
    });

    return () => {
      ScrollTrigger.getAll().forEach((t) => {
        if (t.trigger === section) t.kill();
      });
    };
  }, []);

  return (
    <section ref={sectionRef} className={styles.section}>
      <div className={styles.glow} aria-hidden="true" />
      <div className="container">
        <div className={styles.header}>
          <span className={styles.label}>By The Numbers</span>
          <h2 className={styles.title}>Our Impact</h2>
        </div>
        <div className={styles.grid}>
          {ABOUT_COUNTERS.map((stat) => (
            <div key={stat.label} className={styles.item}>
              <span className={styles.value}>
                <span data-count={stat.value}>0</span>
                {stat.suffix}
              </span>
              <span className={styles.statLabel}>{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { STATS } from "@/lib/constants";
import styles from "./Stats.module.css";

gsap.registerPlugin(ScrollTrigger);

export default function Stats() {
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
          duration: 2,
          ease: "power2.out",
          snap: { innerText: 1 },
          scrollTrigger: {
            trigger: counter,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        }
      );
    });
  }, []);

  return (
    <section ref={sectionRef} className={styles.stats}>
      <div className={styles.glow} aria-hidden="true" />
      <div className="container">
        <div className={styles.grid}>
          {STATS.map((stat) => {
            const numericValue = parseInt(stat.value.replace(/\D/g, ""), 10);
            const suffix = stat.value.replace(/[0-9]/g, "");

            return (
              <div key={stat.label} className={styles.item}>
                <span className={styles.value}>
                  <span data-count={numericValue}>0</span>
                  {suffix}
                </span>
                <span className={styles.label}>{stat.label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SectionHeading from "@/components/ui/SectionHeading";
import { TRANSFORMATION_STATS } from "@/lib/constants";
import styles from "./TransformationCounter.module.css";

gsap.registerPlugin(ScrollTrigger);

export default function TransformationCounter() {
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
          duration: 2.5,
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
    <section ref={sectionRef} className={styles.section} id="transformations">
      <div className={styles.bgGlow} aria-hidden="true" />
      <div className="container">
        <SectionHeading
          subtitle="Real Results"
          title="Transformation Counter"
          description="Numbers that speak louder than words. Join our legacy of success."
        />
        <div className={styles.grid}>
          {TRANSFORMATION_STATS.map((stat, i) => (
            <div key={stat.label} className={styles.item} style={{ animationDelay: `${i * 0.1}s` }}>
              <span className={styles.value}>
                <span data-count={stat.value}>0</span>
                {stat.suffix}
              </span>
              <span className={styles.label}>{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import styles from "./PageHero.module.css";

interface PageHeroProps {
  title: string;
  subtitle?: string;
  breadcrumb?: string;
}

export default function PageHero({ title, subtitle, breadcrumb }: PageHeroProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    gsap.fromTo(
      el.querySelectorAll("[data-animate]"),
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 0.8, stagger: 0.15, ease: "power3.out" }
    );
  }, []);

  return (
    <section ref={ref} className={styles.hero}>
      <div className={styles.pattern} aria-hidden="true" />
      <div className={styles.glow} aria-hidden="true" />
      <div className="container">
        {breadcrumb && (
          <span data-animate className={styles.breadcrumb}>
            {breadcrumb}
          </span>
        )}
        <h1 data-animate className={styles.title}>
          {title}
        </h1>
        {subtitle && (
          <p data-animate className={styles.subtitle}>
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
}

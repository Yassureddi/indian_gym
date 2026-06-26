"use client";

import { useEffect, useRef } from "react";
import { gsap, ensureGsapPlugins } from "@/lib/animations/gsap";
import { useReducedMotion } from "@/lib/animations/useReducedMotion";
import Parallax from "@/components/animations/Parallax";
import styles from "./PageHero.module.css";

interface PageHeroProps {
  title: string;
  subtitle?: string;
  breadcrumb?: string;
}

export default function PageHero({ title, subtitle, breadcrumb }: PageHeroProps) {
  const ref = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || reducedMotion) return;

    ensureGsapPlugins();

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el.querySelectorAll("[data-animate]"),
        { opacity: 0, y: 36, scale: 0.96 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.85,
          stagger: 0.12,
          ease: "power3.out",
        }
      );
    }, ref);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section ref={ref} className={styles.hero}>
      <Parallax speed={0.08} className={styles.parallaxGlow}>
        <div className={styles.glow} aria-hidden="true" />
      </Parallax>
      <div className={styles.pattern} aria-hidden="true" />
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

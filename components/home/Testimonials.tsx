"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import SectionHeading from "@/components/ui/SectionHeading";
import { TESTIMONIALS } from "@/lib/constants";
import styles from "./Testimonials.module.css";

export default function Testimonials() {
  const [active, setActive] = useState(0);
  const current = TESTIMONIALS[active];

  const next = () => setActive((a) => (a + 1) % TESTIMONIALS.length);
  const prev = () => setActive((a) => (a - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);

  return (
    <section className={`section ${styles.section}`} id="testimonials">
      <div className={styles.glow} aria-hidden="true" />
      <div className="container">
        <SectionHeading
          subtitle="Member Stories"
          title="What Our Members Say"
          description="Real voices from real transformations."
        />

        <div className={styles.carousel}>
          <button className={styles.navBtn} onClick={prev} aria-label="Previous testimonial">
            ‹
          </button>

          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              className={styles.card}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.45, ease: [0.25, 0.1, 0.25, 1] }}
            >
              <div className={styles.stars}>
                {Array.from({ length: current.rating }).map((_, i) => (
                  <span key={i}>★</span>
                ))}
              </div>
              <blockquote className={styles.quote}>&ldquo;{current.quote}&rdquo;</blockquote>
              <div className={styles.author}>
                <Image
                  src={current.image}
                  alt={current.name}
                  width={56}
                  height={56}
                  className={styles.avatar}
                />
                <div>
                  <cite className={styles.name}>{current.name}</cite>
                  <span className={styles.role}>{current.role}</span>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          <button className={styles.navBtn} onClick={next} aria-label="Next testimonial">
            ›
          </button>
        </div>

        <div className={styles.dots}>
          {TESTIMONIALS.map((_, i) => (
            <button
              key={i}
              className={`${styles.dot} ${i === active ? styles.activeDot : ""}`}
              onClick={() => setActive(i)}
              aria-label={`Go to testimonial ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

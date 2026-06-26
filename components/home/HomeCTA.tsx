"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Button from "@/components/ui/Button";
import { CONTACT } from "@/lib/constants";
import styles from "./HomeCTA.module.css";

gsap.registerPlugin(ScrollTrigger);

export default function HomeCTA() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const content = contentRef.current;
    if (!section || !content) return;

    gsap.fromTo(
      content,
      { opacity: 0, y: 50, scale: 0.96 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: section,
          start: "top 80%",
          toggleActions: "play none none none",
        },
      }
    );
  }, []);

  const whatsappHref = `https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent("I want to claim my free trial at KN Raju Fitness!")}`;

  return (
    <section ref={sectionRef} className={styles.section} id="free-trial">
      <div className={styles.bgPattern} aria-hidden="true" />
      <div className={styles.glow} aria-hidden="true" />
      <div className="container">
        <div ref={contentRef} className={styles.inner}>
          <span className={styles.label}>Limited Offer</span>
          <h2 className={styles.title}>
            Start Your <span className="brand-gradient-text">Free 3-Day Trial</span>
          </h2>
          <p className={styles.description}>
            Experience premium fitness with zero commitment. Unlimited gym access,
            group classes, and a complimentary fitness assessment.
          </p>
          <ul className={styles.perks}>
            {["No credit card", "Full gym access", "Free assessment"].map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
          <div className={styles.buttons}>
            <Button href="/free-trial" variant="primary" size="lg">
              Claim Free Trial
            </Button>
            <Button href="/membership" variant="outline" size="lg">
              View Plans
            </Button>
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.whatsapp}
            >
              WhatsApp Us
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

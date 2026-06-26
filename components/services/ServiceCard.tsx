"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ServiceItem } from "@/lib/services";
import ServiceIcon from "./ServiceIcon";
import styles from "./ServiceCard.module.css";

interface ServiceCardProps {
  service: ServiceItem;
  index: number;
}

export default function ServiceCard({ service, index }: ServiceCardProps) {
  return (
    <motion.article
      className={styles.card}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.55, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -8, scale: 1.02 }}
      style={{ willChange: "transform" }}
    >
      <div className={styles.imageWrap}>
        <Image
          src={service.image}
          alt={service.title}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className={styles.image}
        />
        <div className={styles.imageOverlay} />
        <div className={styles.iconBadge}>
          <ServiceIcon type={service.icon} />
        </div>
      </div>

      <div className={styles.body}>
        <h3 className={styles.title}>{service.title}</h3>
        <p className={styles.description}>{service.description}</p>

        <ul className={styles.benefits}>
          {service.benefits.map((benefit) => (
            <li key={benefit}>
              <span className={styles.check} aria-hidden="true">✓</span>
              {benefit}
            </li>
          ))}
        </ul>

        <div className={styles.footer}>
          <span className={styles.duration}>
            <ClockIcon />
            {service.duration}
          </span>
          <Link href={service.ctaHref} className={styles.cta}>
            {service.cta}
            <ArrowIcon />
          </Link>
        </div>
      </div>

      <div className={styles.shine} aria-hidden="true" />
    </motion.article>
  );
}

function ClockIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 6v6l4 2" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}

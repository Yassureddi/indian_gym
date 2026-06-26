import type { Metadata } from "next";
import Link from "next/link";
import Button from "@/components/ui/Button";
import { createMetadata } from "@/lib/metadata";
import styles from "./not-found.module.css";

export const metadata: Metadata = createMetadata({
  title: "Page Not Found",
  description: "The page you are looking for does not exist.",
  noIndex: true,
});

export default function NotFound() {
  return (
    <section className={styles.section} aria-labelledby="not-found-title">
      <p className={styles.code}>404</p>
      <h1 id="not-found-title" className={styles.title}>
        Page Not Found
      </h1>
      <p className={styles.text}>
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <div className={styles.actions}>
        <Button href="/" variant="primary" size="lg">
          Back to Home
        </Button>
        <Link href="/contact" className={styles.link}>
          Contact Us
        </Link>
      </div>
    </section>
  );
}

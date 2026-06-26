import Image from "next/image";
import Link from "next/link";
import FadeIn from "@/components/animations/FadeIn";
import SectionHeading from "@/components/ui/SectionHeading";
import Button from "@/components/ui/Button";
import styles from "./AboutPreview.module.css";

export default function AboutPreview() {
  return (
    <section className={`section ${styles.section}`} id="about">
      <div className="container">
        <div className={styles.grid}>
          <FadeIn direction="left" className={styles.visual}>
            <div className={styles.imageStack}>
              <Image
                src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&h=750&fit=crop"
                alt="KN Raju Fitness premium gym"
                width={520}
                height={650}
                className={styles.mainImage}
              />
              <div className={styles.floatingCard}>
                <span className={styles.cardValue}>15+</span>
                <span className={styles.cardLabel}>Years of Excellence</span>
              </div>
            </div>
          </FadeIn>

          <FadeIn direction="right" className={styles.content}>
            <SectionHeading
              subtitle="About Us"
              title="Where Strength Meets Luxury"
              description="INDIAN GYM K N RAJU FITNESS is Hyderabad's premier destination for those who demand excellence in every rep."
              align="left"
            />
            <p className={styles.text}>
              Founded by K N Raju, we&apos;ve spent over 15 years transforming
              lives through world-class training, elite equipment, and an
              atmosphere that inspires greatness.
            </p>
            <ul className={styles.features}>
              {[
                "State-of-the-art equipment",
                "Certified elite trainers",
                "Personalized programs",
                "Luxury recovery facilities",
              ].map((item) => (
                <li key={item}>
                  <span className={styles.check}>✓</span>
                  {item}
                </li>
              ))}
            </ul>
            <Button href="/about" variant="primary">
              Discover Our Story
            </Button>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}

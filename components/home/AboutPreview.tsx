import FadeIn from "@/components/animations/FadeIn";
import Parallax from "@/components/animations/Parallax";
import SectionHeading from "@/components/ui/SectionHeading";
import Button from "@/components/ui/Button";
import AboutPreviewImage from "@/components/home/AboutPreviewImage";
import styles from "./AboutPreview.module.css";

export default function AboutPreview() {
  return (
    <section className={`section ${styles.section}`} id="about">
      <div className="container">
        <div className={styles.grid}>
          <FadeIn direction="left" className={styles.visual}>
            <Parallax speed={0.1}>
              <AboutPreviewImage />
            </Parallax>
          </FadeIn>

          <FadeIn direction="right" variant="zoom" className={styles.content}>
            <SectionHeading
              subtitle="About Us"
              title="Where Strength Meets Luxury"
              description="INDIAN GYM K N RAJU FITNESS is Visakhapatnam's premier destination for those who demand excellence in every rep."
              align="left"
            />            <p className={styles.text}>
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

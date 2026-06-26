import Image from "next/image";
import FadeIn from "@/components/animations/FadeIn";
import SectionHeading from "@/components/ui/SectionHeading";
import Button from "@/components/ui/Button";
import { ABOUT_STORY } from "@/lib/about";
import styles from "./AboutStory.module.css";

export default function AboutStory() {
  return (
    <section className={`section ${styles.section}`} id="our-story">
      <div className={styles.glow} aria-hidden="true" />
      <div className="container">
        <div className={styles.grid}>
          <FadeIn direction="left" className={styles.visual}>
            <div className={styles.imageFrame}>
              <Image
                src={ABOUT_STORY.image}
                alt="KN Raju Fitness gym"
                width={600}
                height={720}
                className={styles.image}
              />
              <div className={styles.frameAccent} aria-hidden="true" />
            </div>
          </FadeIn>

          <FadeIn direction="right" className={styles.content}>
            <SectionHeading
              subtitle={ABOUT_STORY.title}
              title={ABOUT_STORY.headline}
              align="left"
            />
            {ABOUT_STORY.paragraphs.map((p) => (
              <p key={p.slice(0, 40)} className={styles.text}>
                {p}
              </p>
            ))}
            <Button href="/membership" variant="primary">
              Join Our Family
            </Button>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}

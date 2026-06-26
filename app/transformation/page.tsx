import type { Metadata } from "next";
import Image from "next/image";
import PageHero from "@/components/ui/PageHero";
import FadeIn from "@/components/animations/FadeIn";
import GlassCard from "@/components/ui/GlassCard";
import Button from "@/components/ui/Button";
import { TRANSFORMATIONS } from "@/lib/constants";
import { createMetadata } from "@/lib/metadata";
import styles from "./page.module.css";

export const metadata: Metadata = createMetadata(
  "Transformations",
  "Real transformation stories from members of INDIAN GYM K N RAJU FITNESS.",
  "/transformation"
);

export default function TransformationPage() {
  return (
    <>
      <PageHero
        title="Transformations"
        subtitle="Real results from real members. Your success story starts here."
        breadcrumb="Success Stories"
      />

      <section className="section">
        <div className="container">
          <div className={styles.grid}>
            {TRANSFORMATIONS.map((item, i) => (
              <FadeIn key={item.id} delay={i * 0.15}>
                <GlassCard className={styles.card} hover={false}>
                  <div className={styles.images}>
                    <div className={styles.imageBlock}>
                      <span className={styles.label}>Before</span>
                      <Image
                        src={item.before}
                        alt={`${item.name} before`}
                        width={300}
                        height={400}
                        className={styles.image}
                      />
                    </div>
                    <div className={styles.arrow}>→</div>
                    <div className={styles.imageBlock}>
                      <span className={styles.labelAfter}>After</span>
                      <Image
                        src={item.after}
                        alt={`${item.name} after`}
                        width={300}
                        height={400}
                        className={styles.image}
                      />
                    </div>
                  </div>
                  <div className={styles.info}>
                    <h3 className={styles.name}>{item.name}</h3>
                    <div className={styles.stats}>
                      <span>{item.duration}</span>
                      <span className={styles.weightLoss}>{item.weightLoss} lost</span>
                    </div>
                    <p className={styles.story}>{item.story}</p>
                  </div>
                </GlassCard>
              </FadeIn>
            ))}
          </div>
          <div className={styles.cta}>
            <Button href="/free-trial" variant="primary" size="lg">
              Start Your Transformation
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}

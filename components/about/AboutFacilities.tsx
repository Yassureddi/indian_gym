import Image from "next/image";
import FadeIn from "@/components/animations/FadeIn";
import GsapReveal from "@/components/animations/GsapReveal";
import SectionHeading from "@/components/ui/SectionHeading";
import GlassCard from "@/components/ui/GlassCard";
import { ABOUT_FACILITIES } from "@/lib/about";
import styles from "./AboutFacilities.module.css";

const ICONS: Record<string, string> = {
  areas: "🚻",
  ac: "❄️",
  equipment: "🏋️",
  trainers: "🎓",
  environment: "✨",
  recovery: "🧘",
};

export default function AboutFacilities() {
  return (
    <section className={`section ${styles.section}`} id="facilities">
      <div className="container">
        <SectionHeading
          subtitle="World-Class Amenities"
          title="Our Facilities & Equipment"
          description="Every detail designed for your comfort, performance, and transformation."
        />

        <GsapReveal className={styles.grid}>
          {ABOUT_FACILITIES.map((facility) => (
            <GlassCard key={facility.id} className={styles.card} padding="sm">
              <div className={styles.imageWrap}>
                <Image
                  src={facility.image}
                  alt={facility.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className={styles.image}
                />
                <div className={styles.imageOverlay} />
                <span className={styles.icon}>{ICONS[facility.icon] || "⭐"}</span>
              </div>
              <div className={styles.body}>
                <h3 className={styles.title}>{facility.title}</h3>
                <p className={styles.desc}>{facility.description}</p>
              </div>
            </GlassCard>
          ))}
        </GsapReveal>

        <FadeIn>
          <div className={styles.highlight}>
            <div className={styles.highlightInner}>
              <h3>Premium Training Environment</h3>
              <p>
                From separate ladies&apos; and gents&apos; workout areas to fully
                air-conditioned floors, certified trainers, and immaculately
                maintained equipment — every aspect of INDIAN GYM K N RAJU
                FITNESS reflects our commitment to luxury and professionalism.
              </p>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

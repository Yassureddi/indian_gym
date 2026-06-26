import FadeIn from "@/components/animations/FadeIn";
import GlassCard from "@/components/ui/GlassCard";
import { ABOUT_MISSION, ABOUT_VISION } from "@/lib/about";
import styles from "./MissionVision.module.css";

function MissionIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" fill="currentColor" />
    </svg>
  );
}

function VisionIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

export default function MissionVision() {
  const items = [
    { ...ABOUT_MISSION, Icon: MissionIcon },
    { ...ABOUT_VISION, Icon: VisionIcon },
  ];

  return (
    <section className={`section ${styles.section}`}>
      <div className="container">
        <div className={styles.grid}>
          {items.map((item, i) => (
            <FadeIn key={item.title} delay={i * 0.15}>
              <GlassCard className={styles.card} hover={false} padding="lg">
                <div className={styles.iconWrap}>
                  <item.Icon />
                </div>
                <span className={styles.label}>{item.title}</span>
                <h2 className={styles.headline}>{item.headline}</h2>
                <p className={styles.desc}>{item.description}</p>
              </GlassCard>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

import GsapReveal from "@/components/animations/GsapReveal";
import SectionHeading from "@/components/ui/SectionHeading";
import GlassCard from "@/components/ui/GlassCard";
import Button from "@/components/ui/Button";
import { SERVICES } from "@/lib/constants";
import styles from "./HomeServices.module.css";

const ICONS: Record<string, string> = {
  dumbbell: "🏋️",
  users: "👥",
  strength: "💪",
  nutrition: "🥗",
  cardio: "🏃",
  spa: "🧘",
};

export default function HomeServices() {
  return (
    <section className={`section ${styles.section}`} id="services">
      <div className="container">
        <SectionHeading
          subtitle="What We Offer"
          title="Premium Services"
          description="Comprehensive fitness solutions crafted for champions."
        />
        <GsapReveal className={styles.grid}>
          {SERVICES.map((service) => (
            <GlassCard key={service.id} className={styles.card}>
              <span className={styles.icon}>{ICONS[service.icon] || "⭐"}</span>
              <h3 className={styles.title}>{service.title}</h3>
              <p className={styles.desc}>{service.description}</p>
              <span className={styles.price}>{service.price}</span>
            </GlassCard>
          ))}
        </GsapReveal>
        <div className={styles.cta}>
          <Button href="/services" variant="outline" size="lg">
            Explore All Services
          </Button>
        </div>
      </div>
    </section>
  );
}

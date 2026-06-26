import GsapReveal from "@/components/animations/GsapReveal";
import GlassCard from "@/components/ui/GlassCard";
import SectionHeading from "@/components/ui/SectionHeading";
import styles from "./Features.module.css";

const FEATURES = [
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.57 14.86L22 13.43 20.57 12 17 15.57 8.43 7 12 3.43 10.57 2 9.14 3.43 7.71 2 5.57 4.14 4.14 2.71 2.71 4.14l1.43 1.43L2 7.71l1.43 1.43L2 10.57 3.43 12 7 8.43 15.57 17 12 20.57 13.43 22l1.43-1.43L16.29 22l2.14-2.14 1.43 1.43 1.43-1.43-1.43-1.43L22 16.29z" />
      </svg>
    ),
    title: "Elite Equipment",
    description: "Premium machines from world-leading brands for optimal training.",
  },
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
      </svg>
    ),
    title: "Expert Trainers",
    description: "Certified professionals dedicated to your fitness journey.",
  },
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
        <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67V7z" />
      </svg>
    ),
    title: "Flexible Hours",
    description: "Open early till late. Elite members enjoy 24/7 access.",
  },
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z" />
      </svg>
    ),
    title: "Safe & Clean",
    description: "Hygienic environment with regular sanitization protocols.",
  },
];

export default function Features() {
  return (
    <section className="section">
      <div className="container">
        <SectionHeading
          subtitle="Why Choose Us"
          title="The Premium Difference"
          description="Experience fitness redefined with our world-class facilities and personalized approach."
        />

        <GsapReveal className={styles.grid}>
          {FEATURES.map((feature) => (
            <GlassCard key={feature.title} className={styles.card}>
              <div className={styles.icon}>{feature.icon}</div>
              <h3 className={styles.title}>{feature.title}</h3>
              <p className={styles.description}>{feature.description}</p>
            </GlassCard>
          ))}
        </GsapReveal>
      </div>
    </section>
  );
}

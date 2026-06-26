import FadeIn from "@/components/animations/FadeIn";
import SectionHeading from "@/components/ui/SectionHeading";
import GlassCard from "@/components/ui/GlassCard";
import { PAYMENT_MODES } from "@/lib/membership";
import styles from "./PaymentModes.module.css";

function UpiIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <path d="M2 10h20" />
      <path d="M6 15h.01M10 15h4" />
    </svg>
  );
}

function CashIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="2" y="6" width="20" height="12" rx="2" />
      <circle cx="12" cy="12" r="3" />
      <path d="M6 12h.01M18 12h.01" />
    </svg>
  );
}

const ICONS = { upi: UpiIcon, cash: CashIcon };

export default function PaymentModes() {
  return (
    <section className={styles.section}>
      <div className="container">
        <SectionHeading
          subtitle="Easy Payments"
          title="Payment Modes"
          description="Flexible payment options for your convenience."
        />

        <div className={styles.grid}>
          {PAYMENT_MODES.map((mode, i) => {
            const Icon = ICONS[mode.icon];
            return (
              <FadeIn key={mode.id} delay={i * 0.12}>
                <GlassCard className={styles.card} hover={false} padding="lg">
                  <div className={styles.iconWrap}>
                    <Icon />
                  </div>
                  <h3 className={styles.name}>{mode.name}</h3>
                  <p className={styles.desc}>{mode.description}</p>
                </GlassCard>
              </FadeIn>
            );
          })}
        </div>

        <p className={styles.note}>
          Card payments and net banking also accepted at the front desk.
        </p>
      </div>
    </section>
  );
}

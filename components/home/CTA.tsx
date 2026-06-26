import FadeIn from "@/components/animations/FadeIn";
import Button from "@/components/ui/Button";
import styles from "./CTA.module.css";

export default function CTA() {
  return (
    <section className={styles.cta}>
      <div className={styles.glow} aria-hidden="true" />
      <div className="container">
        <FadeIn>
          <div className={styles.inner}>
            <h2 className={styles.title}>
              Ready to Transform Your <span className="gold-text">Life</span>?
            </h2>
            <p className={styles.description}>
              Join thousands of members who have achieved their fitness goals.
              Start with a free 3-day trial today.
            </p>
            <div className={styles.buttons}>
              <Button href="/free-trial" variant="primary" size="lg">
                Claim Free Trial
              </Button>
              <Button href="/contact" variant="secondary" size="lg">
                Contact Us
              </Button>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

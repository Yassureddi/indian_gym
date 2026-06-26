import FadeIn from "@/components/animations/FadeIn";
import SectionHeading from "@/components/ui/SectionHeading";
import GlassCard from "@/components/ui/GlassCard";
import Button from "@/components/ui/Button";
import { MEMBERSHIP_PLANS } from "@/lib/membership";
import styles from "./HomeMembership.module.css";

export default function HomeMembership() {
  return (
    <section className="section" id="membership">
      <div className="container">
        <SectionHeading
          subtitle="Membership"
          title="Choose Your Path"
          description="Strength Training or Cardio + Strength — plans for every commitment level."
        />
        <div className={styles.grid}>
          {MEMBERSHIP_PLANS.map((plan, i) => (
            <FadeIn key={plan.id} delay={i * 0.12}>
              <GlassCard
                className={`${styles.card} ${plan.popular ? styles.popular : ""}`}
                hover={false}
              >
                {plan.popular && <span className={styles.badge}>Most Popular</span>}
                <h3 className={styles.name}>{plan.name}</h3>
                <p className={styles.period}>{plan.period}</p>

                <div className={styles.categories}>
                  {plan.categories.map((category) => (
                    <div key={category.id} className={styles.categoryBlock}>
                      <p className={styles.categoryName}>{category.name}</p>
                      <p className={styles.categoryPrice}>
                        ₹{category.price.toLocaleString("en-IN")}
                      </p>
                      <ul className={styles.features}>
                        {category.features.slice(0, 3).map((f) => (
                          <li key={f}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                            </svg>
                            {f}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>

                <Button
                  href="/membership"
                  variant={plan.popular ? "primary" : "outline"}
                  className={styles.btn}
                >
                  View Plans
                </Button>
              </GlassCard>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

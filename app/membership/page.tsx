import type { Metadata } from "next";
import PageHero from "@/components/ui/PageHero";
import SectionHeading from "@/components/ui/SectionHeading";
import PricingCard from "@/components/membership/PricingCard";
import PaymentModes from "@/components/membership/PaymentModes";
import JsonLd from "@/components/seo/JsonLd";
import { MEMBERSHIP_PLANS } from "@/lib/membership";
import { createMetadata } from "@/lib/metadata";
import { membershipOfferSchema, breadcrumbSchema } from "@/lib/seo/schema";
import styles from "./page.module.css";

export const metadata: Metadata = createMetadata(
  "Membership",
  "Gym membership plans in Visakhapatnam from ₹1,500/month. Strength Training & Cardio + Strength plans. Monthly, Quarterly, Half Yearly & Yearly at INDIAN GYM K N RAJU FITNESS.",
  "/membership"
);

export default function MembershipPage() {
  return (
    <>
      <JsonLd
        data={[
          membershipOfferSchema(),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Membership", path: "/membership" },
          ]),
        ]}
      />
      <PageHero
        title="Membership Plans"
        subtitle="Choose Strength Training or Cardio + Strength — flexible billing for every fitness goal"
        breadcrumb="Pricing"
      />

      <section className={`section ${styles.plansSection}`}>
        <div className="container">
          <SectionHeading
            subtitle="Choose Your Plan"
            title="Premium Training, Clear Pricing"
            description="Every plan includes professional trainer guidance, fitness assessment, locker access, and gym-hours training."
          />

          <div className={styles.grid}>
            {MEMBERSHIP_PLANS.map((plan, index) => (
              <PricingCard key={plan.id} plan={plan} index={index} />
            ))}
          </div>
        </div>
      </section>

      <PaymentModes />
    </>
  );
}

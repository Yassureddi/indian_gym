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
  "Gym membership plans in Visakhapatnam from ₹2,999/month. Monthly, Quarterly, Half Yearly & Yearly plans at INDIAN GYM K N RAJU FITNESS. UPI & cash accepted.",
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
        subtitle="Invest in yourself with flexible billing — the longer you commit, the more you save"
        breadcrumb="Pricing"
      />

      <section className={`section ${styles.plansSection}`}>
        <div className="container">
          <SectionHeading
            subtitle="Choose Your Plan"
            title="Luxury Fitness, Flexible Pricing"
            description="All plans include access to our premium facilities, certified trainers, and separate ladies & gents workout areas."
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

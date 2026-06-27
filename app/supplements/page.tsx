import type { Metadata } from "next";
import PageHero from "@/components/ui/PageHero";
import SectionHeading from "@/components/ui/SectionHeading";
import SupplementsClient from "@/components/supplements/SupplementsClient";
import { createMetadata } from "@/lib/metadata";
import styles from "./page.module.css";

export const metadata: Metadata = createMetadata(
  "Supplements",
  "Premium fitness supplements at INDIAN GYM K N RAJU FITNESS — protein, creatine, pre-workout, and more. Order online with cash or UPI.",
  "/supplements"
);

export default function SupplementsPage() {
  return (
    <>
      <PageHero
        title="Premium Supplements"
        subtitle="Fuel your training with quality nutrition products"
        breadcrumb="Supplements"
      />

      <section className={`section ${styles.section}`}>
        <div className="container">
          <SectionHeading
            subtitle="Nutrition Store"
            title="Shop Supplements"
            description="Browse our curated selection of premium supplements — managed and updated directly from our admin portal."
          />
          <SupplementsClient />
        </div>
      </section>
    </>
  );
}

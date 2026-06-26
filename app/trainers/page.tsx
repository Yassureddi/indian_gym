import type { Metadata } from "next";
import PageHero from "@/components/ui/PageHero";
import SectionHeading from "@/components/ui/SectionHeading";
import TrainerCard from "@/components/trainers/TrainerCard";
import Button from "@/components/ui/Button";
import JsonLd from "@/components/seo/JsonLd";
import { TRAINERS } from "@/lib/trainers";
import { createMetadata } from "@/lib/metadata";
import { trainersListSchema, breadcrumbSchema } from "@/lib/seo/schema";
import styles from "./page.module.css";

export const metadata: Metadata = createMetadata(
  "Trainers",
  "Meet certified fitness trainers at INDIAN GYM K N RAJU FITNESS, Visakhapatnam. Expert coaches for bodybuilding, weight loss, and personal training.",
  "/trainers"
);

export default function TrainersPage() {
  return (
    <>
      <JsonLd
        data={[
          trainersListSchema(),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Trainers", path: "/trainers" },
          ]),
        ]}
      />
      <PageHero
        title="Our Trainers"
        subtitle="Certified elite professionals dedicated to your transformation"
        breadcrumb="The Team"
      />

      <section className={`section ${styles.section}`}>
        <div className="container">
          <SectionHeading
            subtitle="Expert Coaches"
            title="Train With The Best"
            description="Every trainer holds nationally recognized certifications and brings years of real-world coaching experience."
          />

          <div className={styles.grid}>
            {TRAINERS.map((trainer, index) => (
              <TrainerCard key={trainer.id} trainer={trainer} index={index} />
            ))}
          </div>

          <div className={styles.cta}>
            <p>Ready to train with our experts?</p>
            <Button href="/free-trial" variant="primary" size="lg">
              Book Free Trial
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}

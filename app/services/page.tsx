import type { Metadata } from "next";
import PageHero from "@/components/ui/PageHero";
import ServiceCard from "@/components/services/ServiceCard";
import Button from "@/components/ui/Button";
import SectionHeading from "@/components/ui/SectionHeading";
import JsonLd from "@/components/seo/JsonLd";
import { FITNESS_SERVICES } from "@/lib/services";
import { createMetadata } from "@/lib/metadata";
import { serviceListSchema, breadcrumbSchema } from "@/lib/seo/schema";
import styles from "./page.module.css";

export const metadata: Metadata = createMetadata(
  "Services",
  "Premium fitness services at KN Raju Fitness, Visakhapatnam — Weight Loss, Muscle Building, Strength Training, Cardio, and Personal Training.",
  "/services"
);

export default function ServicesPage() {
  return (
    <>
      <JsonLd
        data={[
          serviceListSchema(),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Services", path: "/services" },
          ]),
        ]}
      />
      <PageHero
        title="Our Services"
        subtitle="Expert-led programs designed to transform your body and elevate your performance"
        breadcrumb="What We Offer"
      />

      <section className={`section ${styles.section}`}>
        <div className="container">
          <SectionHeading
            subtitle="Programs"
            title="Choose Your Path"
            description="Every program is led by certified trainers with personalized plans tailored to your goals."
          />

          <div className={styles.grid}>
            {FITNESS_SERVICES.map((service, index) => (
              <ServiceCard key={service.id} service={service} index={index} />
            ))}
          </div>

          <div className={styles.bottomCta}>
            <p>Not sure which program is right for you?</p>
            <div className={styles.buttons}>
              <Button href="/free-trial" variant="primary" size="lg">
                Book Free Trial
              </Button>
              <Button href="/contact" variant="outline" size="lg">
                Talk to a Trainer
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

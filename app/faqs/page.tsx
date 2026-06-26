import type { Metadata } from "next";
import PageHero from "@/components/ui/PageHero";
import FAQAccordion from "@/components/faqs/FAQAccordion";
import Button from "@/components/ui/Button";
import JsonLd from "@/components/seo/JsonLd";
import { createMetadata } from "@/lib/metadata";
import { faqPageSchema, breadcrumbSchema } from "@/lib/seo/schema";
import styles from "./page.module.css";

export const metadata: Metadata = createMetadata(
  "FAQs",
  "Frequently asked questions about INDIAN GYM K N RAJU FITNESS membership, facilities, timings, and services in Visakhapatnam.",
  "/faqs"
);

export default function FAQsPage() {
  return (
    <>
      <JsonLd
        data={[
          faqPageSchema(),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "FAQs", path: "/faqs" },
          ]),
        ]}
      />
      <PageHero
        title="Frequently Asked Questions"
        subtitle="Everything you need to know before joining"
        breadcrumb="Help Center"
      />

      <section className="section">
        <div className="container">
          <FAQAccordion />
          <div className={styles.cta}>
            <p>Still have questions?</p>
            <Button href="/contact" variant="primary">
              Contact Us
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}

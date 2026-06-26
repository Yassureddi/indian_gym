import type { Metadata } from "next";
import PageHero from "@/components/ui/PageHero";
import ContactForm from "@/components/contact/ContactForm";
import ContactDetails from "@/components/contact/ContactDetails";
import ContactMap from "@/components/contact/ContactMap";
import JsonLd from "@/components/seo/JsonLd";
import { createMetadata } from "@/lib/metadata";
import { breadcrumbSchema, localBusinessSchema } from "@/lib/seo/schema";
import styles from "./page.module.css";

export const metadata: Metadata = createMetadata(
  "Contact",
  "Contact INDIAN GYM K N RAJU FITNESS in Visakhapatnam. Call 8142113631 or message us on WhatsApp. Visit us near Timpany School, Asilmetta.",
  "/contact"
);

export default function ContactPage() {
  return (
    <>
      <JsonLd
        data={[
          localBusinessSchema(),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Contact", path: "/contact" },
          ]),
        ]}
      />
      <PageHero
        title="Contact Us"
        subtitle="Visit us in Asilmetta, Visakhapatnam or message us instantly on WhatsApp"
        breadcrumb="Get In Touch"
      />

      <section className={`section ${styles.section}`}>
        <div className="container">
          <div className={styles.grid}>
            <ContactForm />
            <ContactDetails />
          </div>
          <ContactMap />
        </div>
      </section>
    </>
  );
}

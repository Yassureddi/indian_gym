import type { Metadata } from "next";
import PageHero from "@/components/ui/PageHero";
import TrialForm from "@/components/forms/TrialForm";
import { createMetadata } from "@/lib/metadata";

export const metadata: Metadata = createMetadata(
  "Free Trial",
  "Start your 3-day free trial at INDIAN GYM K N RAJU FITNESS. No commitment required.",
  "/free-trial"
);

export default function FreeTrialPage() {
  return (
    <>
      <PageHero
        title="Free 3-Day Trial"
        subtitle="Experience premium fitness with zero commitment"
        breadcrumb="Get Started"
      />
      <section className="section">
        <div className="container">
          <TrialForm />
        </div>
      </section>
    </>
  );
}

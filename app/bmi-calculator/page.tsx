import type { Metadata } from "next";
import PageHero from "@/components/ui/PageHero";
import BMICalculator from "@/components/bmi/BMICalculator";
import { createMetadata } from "@/lib/metadata";
import styles from "./page.module.css";

export const metadata: Metadata = createMetadata(
  "BMI Calculator",
  "Calculate your BMI with age and gender inputs. Get personalized diet and workout suggestions from KN Raju Fitness.",
  "/bmi-calculator"
);

export default function BMICalculatorPage() {
  return (
    <>
      <PageHero
        title="BMI Calculator"
        subtitle="Calculate your BMI and receive personalized diet and workout recommendations"
        breadcrumb="Health Tools"
      />
      <section className={`section ${styles.section}`}>
        <div className="container">
          <BMICalculator />
        </div>
      </section>
    </>
  );
}

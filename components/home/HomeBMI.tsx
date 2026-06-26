import FadeIn from "@/components/animations/FadeIn";
import SectionHeading from "@/components/ui/SectionHeading";
import BMICalculator from "@/components/bmi/BMICalculator";
import styles from "./HomeBMI.module.css";

export default function HomeBMI() {
  return (
    <section className={`section ${styles.section}`} id="bmi">
      <div className="container">
        <SectionHeading
          subtitle="Health Tools"
          title="BMI Calculator"
          description="Know your body composition and take the first step toward your transformation."
        />
        <FadeIn>
          <BMICalculator />
        </FadeIn>
      </div>
    </section>
  );
}

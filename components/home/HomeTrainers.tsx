import Image from "next/image";
import Link from "next/link";
import FadeIn from "@/components/animations/FadeIn";
import SectionHeading from "@/components/ui/SectionHeading";
import Button from "@/components/ui/Button";
import { TRAINERS } from "@/lib/trainers";
import styles from "./HomeTrainers.module.css";

export default function HomeTrainers() {
  return (
    <section className="section" id="trainers">
      <div className="container">
        <SectionHeading
          subtitle="The Team"
          title="Expert Trainers"
          description="Certified professionals dedicated to unlocking your full potential."
        />
        <div className={styles.grid}>
          {TRAINERS.map((trainer, i) => (
            <FadeIn key={trainer.id} delay={i * 0.1}>
              <Link href="/trainers" className={styles.card}>
                <div className={styles.imageWrap}>
                  <Image
                    src={trainer.image}
                    alt={trainer.name}
                    fill
                    sizes="(max-width: 768px) 50vw, 25vw"
                    className={styles.image}
                  />
                  <div className={styles.overlay} />
                  <div className={styles.badge}>{trainer.experience}</div>
                </div>
                <div className={styles.info}>
                  <h3>{trainer.name}</h3>
                  <p className={styles.role}>{trainer.role}</p>
                  <span className={styles.specialty}>{trainer.specialty}</span>
                </div>
              </Link>
            </FadeIn>
          ))}
        </div>
        <div className={styles.cta}>
          <Button href="/trainers" variant="outline" size="lg">
            Meet All Trainers
          </Button>
        </div>
      </div>
    </section>
  );
}

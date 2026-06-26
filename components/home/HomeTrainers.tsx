"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import FadeIn from "@/components/animations/FadeIn";
import SectionHeading from "@/components/ui/SectionHeading";
import Button from "@/components/ui/Button";
import type { Trainer } from "@/lib/trainers";
import styles from "./HomeTrainers.module.css";

function isRemoteSrc(src: string) {
  return src.startsWith("http");
}

export default function HomeTrainers() {
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/trainers")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data.trainers)) {
          setTrainers(data.trainers.slice(0, 4));
        }
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="section" id="trainers">
      <div className="container">
        <SectionHeading
          subtitle="The Team"
          title="Expert Trainers"
          description="Certified professionals dedicated to unlocking your full potential."
        />
        {loading ? (
          <p className={styles.empty}>Loading trainers...</p>
        ) : trainers.length === 0 ? (
          <p className={styles.empty}>Trainer profiles will appear here once added in admin.</p>
        ) : (
          <div className={styles.grid}>
            {trainers.map((trainer, i) => (
              <FadeIn key={trainer.id} delay={i * 0.1}>
                <Link href="/trainers" className={styles.card}>
                  <div className={styles.imageWrap}>
                    <Image
                      src={trainer.image}
                      alt={trainer.name}
                      fill
                      sizes="(max-width: 768px) 50vw, 25vw"
                      className={styles.image}
                      unoptimized={!isRemoteSrc(trainer.image)}
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
        )}
        <div className={styles.cta}>
          <Button href="/trainers" variant="outline" size="lg">
            Meet All Trainers
          </Button>
        </div>
      </div>
    </section>
  );
}

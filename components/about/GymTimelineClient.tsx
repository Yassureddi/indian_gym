"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SectionHeading from "@/components/ui/SectionHeading";
import styles from "./GymTimeline.module.css";

gsap.registerPlugin(ScrollTrigger);

export type JourneyMilestone = {
  year: string;
  title: string;
  description: string;
};

export default function GymTimelineClient({ milestones }: { milestones: JourneyMilestone[] }) {
  const sectionRef = useRef<HTMLElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const line = lineRef.current;
    if (!section || !line || milestones.length === 0) return;

    const items = section.querySelectorAll(`.${styles.item}`);

    gsap.fromTo(
      line,
      { scaleY: 0 },
      {
        scaleY: 1,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top 70%",
          end: "bottom 30%",
          scrub: 1,
        },
      }
    );

    items.forEach((item) => {
      gsap.fromTo(
        item,
        { opacity: 0, x: -40 },
        {
          opacity: 1,
          x: 0,
          duration: 0.7,
          ease: "power3.out",
          scrollTrigger: {
            trigger: item,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        }
      );
    });

    return () => {
      ScrollTrigger.getAll().forEach((t) => {
        if (section.contains(t.trigger as Node)) t.kill();
      });
    };
  }, [milestones]);

  if (milestones.length === 0) return null;

  return (
    <section ref={sectionRef} className={`section ${styles.section}`} id="gym-journey">
      <div className={styles.glow} aria-hidden="true" />
      <div className="container">
        <SectionHeading
          subtitle="Our Journey"
          title="The Gym Journey"
          description="From a humble beginning to Hyderabad's premier luxury fitness destination."
        />

        <div className={styles.timeline}>
          <div ref={lineRef} className={styles.line} aria-hidden="true" />
          {milestones.map((milestone, i) => (
            <div
              key={milestone.year}
              className={`${styles.item} ${i % 2 === 0 ? styles.left : styles.right}`}
            >
              <div className={styles.dot} aria-hidden="true">
                <span>{milestone.year}</span>
              </div>
              <div className={styles.card}>
                <h3 className={styles.title}>{milestone.title}</h3>
                <p className={styles.desc}>{milestone.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

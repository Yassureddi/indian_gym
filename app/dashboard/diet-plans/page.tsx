"use client";

import { useEffect, useState } from "react";
import GlassCard from "@/components/ui/GlassCard";
import type { DietPlan } from "@/lib/auth/types";
import styles from "./page.module.css";

export default function DietPlansPage() {
  const [plans, setPlans] = useState<DietPlan[]>([]);

  useEffect(() => {
    fetch("/api/diet-plans")
      .then((res) => res.json())
      .then((data) => setPlans(data.plans ?? []));
  }, []);

  return (
    <div className={styles.page}>
      <h2 className="text-h3">Diet Plans</h2>
      <p className={styles.subtitle}>Nutrition plans tailored to your fitness goals.</p>

      {plans.length === 0 ? (
        <GlassCard hover={false} padding="lg">
          <p className={styles.empty}>No diet plans assigned yet. Check back soon!</p>
        </GlassCard>
      ) : (
        <div className={styles.list}>
          {plans.map((plan) => (
            <GlassCard key={plan.id} hover={false} padding="lg" className={styles.card}>
              <h3>{plan.title}</h3>
              <p className={styles.desc}>{plan.description}</p>
              <div className={styles.meals}>
                {plan.meals.map((meal, i) => (
                  <div key={i} className={styles.meal}>
                    <span className={styles.time}>{meal.time}</span>
                    <p>{meal.items}</p>
                    {meal.calories && <span className={styles.cal}>{meal.calories} kcal</span>}
                  </div>
                ))}
              </div>
            </GlassCard>
          ))}
        </div>
      )}
    </div>
  );
}

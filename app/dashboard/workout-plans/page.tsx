"use client";

import { useEffect, useState } from "react";
import GlassCard from "@/components/ui/GlassCard";
import type { WorkoutPlan } from "@/lib/auth/types";
import styles from "./page.module.css";

export default function WorkoutPlansPage() {
  const [plans, setPlans] = useState<WorkoutPlan[]>([]);

  useEffect(() => {
    fetch("/api/workout-plans")
      .then((res) => res.json())
      .then((data) => setPlans(data.plans ?? []));
  }, []);

  return (
    <div className={styles.page}>
      <h2 className="text-h3">Workout Plans</h2>
      <p className={styles.subtitle}>Personalized training programs assigned by your trainer.</p>

      {plans.length === 0 ? (
        <GlassCard hover={false} padding="lg">
          <p className={styles.empty}>No workout plans assigned yet. Check back soon!</p>
        </GlassCard>
      ) : (
        <div className={styles.list}>
          {plans.map((plan) => (
            <GlassCard key={plan.id} hover={false} padding="lg" className={styles.card}>
              <h3>{plan.title}</h3>
              <p className={styles.desc}>{plan.description}</p>
              <div className={styles.exercises}>
                {plan.exercises.map((ex, i) => (
                  <div key={i} className={styles.exercise}>
                    <strong>{ex.name}</strong>
                    <span>{ex.sets} sets × {ex.reps} reps</span>
                    {ex.notes && <em>{ex.notes}</em>}
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

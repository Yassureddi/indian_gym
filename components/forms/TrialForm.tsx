"use client";

import { useState, FormEvent } from "react";
import { motion } from "framer-motion";
import GlassCard from "@/components/ui/GlassCard";
import Button from "@/components/ui/Button";
import styles from "./TrialForm.module.css";

export default function TrialForm() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <motion.div
        className={styles.success}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <GlassCard hover={false} padding="lg">
          <div className={styles.successIcon}>🎉</div>
          <h3>You&apos;re All Set!</h3>
          <p>
            Your free 3-day trial has been registered. Visit us anytime during
            operating hours with a valid ID to get started.
          </p>
          <Button href="/contact" variant="outline">
            Get Directions
          </Button>
        </GlassCard>
      </motion.div>
    );
  }

  return (
    <div className={styles.wrapper}>
      <GlassCard className={styles.formCard} hover={false} padding="lg">
        <h2 className={styles.formTitle}>Claim Your Free Trial</h2>
        <p className={styles.formSubtitle}>
          Fill in your details and enjoy 3 days of unlimited access
        </p>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <label htmlFor="trial-name">Full Name</label>
            <input id="trial-name" name="name" type="text" required placeholder="Your full name" />
          </div>
          <div className={styles.field}>
            <label htmlFor="trial-email">Email</label>
            <input id="trial-email" name="email" type="email" required placeholder="your@email.com" />
          </div>
          <div className={styles.field}>
            <label htmlFor="trial-phone">Phone Number</label>
            <input id="trial-phone" name="phone" type="tel" required placeholder="+91 XXXXX XXXXX" />
          </div>
          <div className={styles.field}>
            <label htmlFor="trial-goal">Fitness Goal</label>
            <select id="trial-goal" name="goal" required>
              <option value="">Select your goal</option>
              <option value="weight-loss">Weight Loss</option>
              <option value="muscle-gain">Muscle Gain</option>
              <option value="general-fitness">General Fitness</option>
              <option value="athletic-performance">Athletic Performance</option>
            </select>
          </div>
          <Button type="submit" variant="primary" size="lg" className={styles.submit}>
            Start Free Trial
          </Button>
        </form>
      </GlassCard>

      <div className={styles.benefits}>
        <h3>What&apos;s Included</h3>
        <ul>
          {[
            "3 days unlimited gym access",
            "All group classes included",
            "Free fitness assessment",
            "Locker & shower facilities",
            "No credit card required",
          ].map((benefit) => (
            <li key={benefit}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
              </svg>
              {benefit}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

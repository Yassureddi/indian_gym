"use client";

import { useState, FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import GlassCard from "@/components/ui/GlassCard";
import Button from "@/components/ui/Button";
import { calculateBMI } from "@/lib/utils";
import { getBMIResult, BMI_SCALE, type Gender, type BMIResult } from "@/lib/bmi";
import styles from "./BMICalculator.module.css";

export default function BMICalculator() {
  const [age, setAge] = useState("");
  const [gender, setGender] = useState<Gender>("male");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [result, setResult] = useState<BMIResult | null>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const a = parseInt(age, 10);
    const h = parseFloat(height);
    const w = parseFloat(weight);

    if (!a || !h || !w || a <= 0 || h <= 0 || w <= 0) return;

    const bmi = calculateBMI(w, h);
    setResult(getBMIResult(bmi, a, gender));
  };

  const bmiPercent = result
    ? Math.min((result.bmi / 40) * 100, 100)
    : 0;

  return (
    <div className={styles.wrapper}>
      <div className={styles.mainGrid}>
        <GlassCard className={styles.formCard} hover={false} padding="lg">
          <h2 className={styles.formTitle}>Your Details</h2>
          <p className={styles.formSubtitle}>
            Enter your information to calculate BMI and get personalized recommendations.
          </p>

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.row}>
              <div className={styles.inputGroup}>
                <label htmlFor="bmi-age">Age</label>
                <input
                  id="bmi-age"
                  type="number"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  placeholder="e.g. 28"
                  min="10"
                  max="100"
                  required
                />
              </div>

              <div className={styles.inputGroup}>
                <label>Gender</label>
                <div className={styles.genderToggle} role="group" aria-label="Gender">
                  <button
                    type="button"
                    className={`${styles.genderBtn} ${gender === "male" ? styles.genderActive : ""}`}
                    onClick={() => setGender("male")}
                  >
                    Male
                  </button>
                  <button
                    type="button"
                    className={`${styles.genderBtn} ${gender === "female" ? styles.genderActive : ""}`}
                    onClick={() => setGender("female")}
                  >
                    Female
                  </button>
                </div>
              </div>
            </div>

            <div className={styles.row}>
              <div className={styles.inputGroup}>
                <label htmlFor="bmi-height">Height (cm)</label>
                <input
                  id="bmi-height"
                  type="number"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  placeholder="e.g. 175"
                  min="50"
                  max="300"
                  required
                />
              </div>
              <div className={styles.inputGroup}>
                <label htmlFor="bmi-weight">Weight (kg)</label>
                <input
                  id="bmi-weight"
                  type="number"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  placeholder="e.g. 70"
                  min="1"
                  max="500"
                  required
                />
              </div>
            </div>

            <Button type="submit" variant="primary" size="lg" className={styles.submitBtn}>
              Calculate BMI
            </Button>
          </form>
        </GlassCard>

        <div className={styles.scaleCard}>
          <h3 className={styles.scaleTitle}>BMI Categories</h3>
          <div className={styles.scaleItems}>
            {BMI_SCALE.map((item) => (
              <div
                key={item.label}
                className={`${styles.scaleItem} ${
                  result?.category === item.label ||
                  (result?.category === "Normal Weight" && item.label === "Normal")
                    ? styles.scaleItemActive
                    : ""
                }`}
              >
                <span className={styles.dot} style={{ background: item.color }} />
                <div className={styles.scaleInfo}>
                  <span className={styles.scaleRange}>{item.range}</span>
                  <span className={styles.scaleLabel}>{item.label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {result && (
          <motion.div
            key={result.bmi}
            className={styles.resultWrap}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.55, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <GlassCard className={styles.resultCard} hover={false} padding="lg">
              <div className={styles.resultHeader}>
                <div className={styles.gauge}>
                  <svg viewBox="0 0 120 120" className={styles.gaugeSvg}>
                    <circle
                      cx="60"
                      cy="60"
                      r="52"
                      fill="none"
                      stroke="rgba(255,255,255,0.06)"
                      strokeWidth="8"
                    />
                    <motion.circle
                      cx="60"
                      cy="60"
                      r="52"
                      fill="none"
                      stroke={result.color}
                      strokeWidth="8"
                      strokeLinecap="round"
                      strokeDasharray={`${2 * Math.PI * 52}`}
                      initial={{ strokeDashoffset: 2 * Math.PI * 52 }}
                      animate={{
                        strokeDashoffset: 2 * Math.PI * 52 * (1 - bmiPercent / 100),
                      }}
                      transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
                      transform="rotate(-90 60 60)"
                    />
                  </svg>
                  <motion.div
                    className={styles.gaugeValue}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", delay: 0.4, stiffness: 200 }}
                  >
                    <span className={styles.bmiNumber} style={{ color: result.color }}>
                      {result.bmi}
                    </span>
                    <span className={styles.bmiUnit}>BMI</span>
                  </motion.div>
                </div>

                <div className={styles.resultMeta}>
                  <motion.span
                    className={styles.categoryBadge}
                    style={{
                      color: result.color,
                      borderColor: result.color,
                      background: `${result.color}18`,
                    }}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    {result.category}
                  </motion.span>
                  <motion.p
                    className={styles.healthTip}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                  >
                    {result.healthTip}
                  </motion.p>
                </div>
              </div>

              <div className={styles.suggestions}>
                <motion.div
                  className={styles.suggestionCard}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.65 }}
                >
                  <div className={styles.suggestionIcon}>
                    <DietIcon />
                  </div>
                  <div>
                    <h4>Diet Suggestion</h4>
                    <p>{result.dietSuggestion}</p>
                  </div>
                </motion.div>

                <motion.div
                  className={styles.suggestionCard}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.75 }}
                >
                  <div className={styles.suggestionIcon}>
                    <WorkoutIcon />
                  </div>
                  <div>
                    <h4>Workout Suggestion</h4>
                    <p>{result.workoutSuggestion}</p>
                  </div>
                </motion.div>
              </div>

              <motion.div
                className={styles.resultCta}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.85 }}
              >
                <Button href="/free-trial" variant="primary">
                  Start Your Transformation
                </Button>
                <Button href="/contact" variant="outline">
                  Talk to a Trainer
                </Button>
              </motion.div>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function DietIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M12 2C8 6 6 9 6 13a6 6 0 1012 0c0-4-2-7-6-11z" />
      <path d="M12 12v6" />
    </svg>
  );
}

function WorkoutIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M6 12h12M4 9v6M20 9v6M2 10v4M22 10v4" />
    </svg>
  );
}

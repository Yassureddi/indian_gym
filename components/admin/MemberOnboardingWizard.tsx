"use client";

import { FormEvent, useState } from "react";
import Button from "@/components/ui/Button";
import PasswordInput from "@/components/ui/PasswordInput";
import { MEMBERSHIP_PLANS, PAYMENT_MODES, getPlanSelection } from "@/lib/membership";
import type { BillingPeriod, MembershipCategory } from "@/lib/membership";
import shared from "@/components/admin/admin-shared.module.css";
import styles from "./MemberOnboardingWizard.module.css";

type Step = "details" | "plan" | "payment";

interface MemberDetails {
  name: string;
  email: string;
  phone: string;
  password: string;
  goal: string;
  gender: string;
  age: string;
}

interface MemberOnboardingWizardProps {
  onSuccess: (message: string) => void;
  onError: (message: string) => void;
}

const STEPS: { id: Step; label: string }[] = [
  { id: "details", label: "Member Details" },
  { id: "plan", label: "Service Plan" },
  { id: "payment", label: "Payment" },
];

export default function MemberOnboardingWizard({
  onSuccess,
  onError,
}: MemberOnboardingWizardProps) {
  const [step, setStep] = useState<Step>("details");
  const [loading, setLoading] = useState(false);
  const [details, setDetails] = useState<MemberDetails>({
    name: "",
    email: "",
    phone: "",
    password: "",
    goal: "",
    gender: "",
    age: "",
  });
  const [selectedPlan, setSelectedPlan] = useState<BillingPeriod | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<MembershipCategory | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "upi" | null>(null);
  const [reference, setReference] = useState("");

  const stepIndex = STEPS.findIndex((s) => s.id === step);
  const planSelection =
    selectedPlan && selectedCategory
      ? getPlanSelection(selectedPlan, selectedCategory)
      : null;

  const resetWizard = () => {
    setStep("details");
    setDetails({
      name: "",
      email: "",
      phone: "",
      password: "",
      goal: "",
      gender: "",
      age: "",
    });
    setSelectedPlan(null);
    setSelectedCategory(null);
    setPaymentMethod(null);
    setReference("");
  };

  const handleDetailsSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    setDetails({
      name: String(fd.get("name") ?? ""),
      email: String(fd.get("email") ?? ""),
      phone: String(fd.get("phone") ?? ""),
      password: String(fd.get("password") ?? ""),
      goal: String(fd.get("goal") ?? ""),
      gender: String(fd.get("gender") ?? ""),
      age: String(fd.get("age") ?? ""),
    });
    setStep("plan");
    onError("");
  };

  const handlePlanContinue = () => {
    if (!selectedPlan || !selectedCategory) {
      onError("Please select a membership category and billing period.");
      return;
    }
    onError("");
    setStep("payment");
  };

  const handleSelectCategory = (period: BillingPeriod, category: MembershipCategory) => {
    setSelectedPlan(period);
    setSelectedCategory(category);
    onError("");
  };

  const handleConfirmPayment = async () => {
    if (!selectedPlan || !selectedCategory || !paymentMethod) {
      onError("Please select a payment method.");
      return;
    }
    if (paymentMethod === "upi" && !reference.trim()) {
      onError("UPI transaction reference is required.");
      return;
    }

    setLoading(true);
    onError("");
    try {
      const res = await fetch("/api/admin/members/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...details,
          age: Number(details.age),
          planId: selectedPlan,
          categoryId: selectedCategory,
          paymentMethod,
          reference: paymentMethod === "upi" ? reference.trim() : undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      onSuccess(
        `Member ${data.user.name} created and payment of ₹${data.payment.amount.toLocaleString("en-IN")} confirmed.`
      );
      resetWizard();
    } catch (err) {
      onError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.wizard}>
      <div className={styles.steps}>
        {STEPS.map((s, i) => {
          const isActive = s.id === step;
          const isDone = i < stepIndex;
          return (
            <div
              key={s.id}
              className={`${styles.step} ${isActive ? styles.stepActive : ""} ${isDone ? styles.stepDone : ""}`}
            >
              <span className={styles.stepNum}>{isDone ? "✓" : i + 1}</span>
              <span>{s.label}</span>
            </div>
          );
        })}
      </div>

      {step === "details" && (
        <form onSubmit={handleDetailsSubmit} className={shared.formGrid}>
          <div className={shared.field}>
            <label htmlFor="name">Full Name</label>
            <input id="name" name="name" defaultValue={details.name} required />
          </div>
          <div className={shared.field}>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              defaultValue={details.email}
              required
            />
          </div>
          <div className={shared.field}>
            <label htmlFor="phone">Phone Number</label>
            <input
              id="phone"
              name="phone"
              type="tel"
              defaultValue={details.phone}
              required
            />
          </div>
          <div className={shared.field}>
            <label htmlFor="gender">Gender</label>
            <select id="gender" name="gender" defaultValue={details.gender || ""} required>
              <option value="" disabled>
                Select gender
              </option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div className={shared.field}>
            <label htmlFor="age">Age</label>
            <input
              id="age"
              name="age"
              type="number"
              min={1}
              max={120}
              defaultValue={details.age}
              required
            />
          </div>
          <div className={shared.field}>
            <label htmlFor="password">Password</label>
            <PasswordInput
              id="password"
              name="password"
              variant="admin"
              minLength={6}
              defaultValue={details.password}
              required
            />
          </div>
          <div className={`${shared.field} ${shared.fullWidth}`}>
            <label htmlFor="goal">Fitness Goal (optional)</label>
            <input
              id="goal"
              name="goal"
              placeholder="e.g. Weight Loss"
              defaultValue={details.goal}
            />
          </div>
          <div className={shared.fullWidth}>
            <Button type="submit" variant="primary">
              Create Member
            </Button>
          </div>
        </form>
      )}

      {step === "plan" && (
        <>
          <p style={{ fontSize: "0.875rem", color: "var(--color-text-muted)" }}>
            Select a membership category and billing period for <strong>{details.name}</strong>
          </p>
          <div className={styles.planGrid}>
            {MEMBERSHIP_PLANS.map((p) => (
              <div
                key={p.id}
                className={`${styles.planCard} ${selectedPlan === p.id ? styles.planCardActive : ""}`}
              >
                {p.popular && <span className={styles.planBadge}>Most Popular</span>}
                <div className={styles.planName}>{p.name}</div>
                <div className={styles.planPeriod}>{p.period}</div>
                <div className={styles.planCategories}>
                  {p.categories.map((category) => {
                    const isSelected =
                      selectedPlan === p.id && selectedCategory === category.id;
                    return (
                      <button
                        key={category.id}
                        type="button"
                        className={`${styles.categoryOption} ${isSelected ? styles.categoryOptionSelected : ""}`}
                        onClick={() => handleSelectCategory(p.id, category.id)}
                      >
                        <span className={styles.categoryOptionName}>{category.name}</span>
                        <span className={styles.categoryOptionPrice}>
                          ₹{category.price.toLocaleString("en-IN")}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
          <div className={styles.actions}>
            <Button type="button" variant="outline" onClick={() => setStep("details")}>
              Back
            </Button>
            <Button type="button" variant="primary" onClick={handlePlanContinue}>
              Continue to Payment
            </Button>
          </div>
        </>
      )}

      {step === "payment" && planSelection && (
        <>
          <div className={styles.summary}>
            <div className={styles.summaryRow}>
              <span className={styles.summaryLabel}>Member</span>
              <span>{details.name}</span>
            </div>
            <div className={styles.summaryRow}>
              <span className={styles.summaryLabel}>Plan</span>
              <span>
                {planSelection.fullName} — ₹{planSelection.price.toLocaleString("en-IN")}
              </span>
            </div>
          </div>

          <div>
            <p
              style={{
                fontSize: "0.75rem",
                color: "var(--color-text-muted)",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                marginBottom: "0.75rem",
              }}
            >
              Payment Method
            </p>
            <div className={styles.paymentMethods}>
              {PAYMENT_MODES.map((mode) => (
                <button
                  key={mode.id}
                  type="button"
                  className={`${styles.paymentOption} ${paymentMethod === mode.id ? styles.paymentOptionSelected : ""}`}
                  onClick={() => setPaymentMethod(mode.id as "cash" | "upi")}
                >
                  <div className={styles.paymentOptionName}>{mode.name}</div>
                  <p style={{ fontSize: "0.75rem", color: "var(--color-text-muted)", marginTop: "0.5rem" }}>
                    {mode.description}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {paymentMethod === "upi" && (
            <div className={shared.field}>
              <label htmlFor="reference">UPI Transaction Reference</label>
              <input
                id="reference"
                value={reference}
                onChange={(e) => setReference(e.target.value)}
                placeholder="e.g. UPI-123456789"
                required
              />
            </div>
          )}

          <div className={styles.actions}>
            <Button type="button" variant="outline" onClick={() => setStep("plan")}>
              Back
            </Button>
            <Button
              type="button"
              variant="primary"
              disabled={loading || !paymentMethod}
              onClick={handleConfirmPayment}
            >
              {loading ? "Processing…" : "Confirm Payment"}
            </Button>
          </div>
        </>
      )}
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import type { MembershipPlan } from "@/lib/membership";
import shared from "@/components/admin/admin-shared.module.css";

export default function AdminMembershipPlansPage() {
  const [plans, setPlans] = useState<MembershipPlan[]>([]);

  useEffect(() => {
    fetch("/api/admin/overview")
      .then((r) => r.json())
      .then((d) => setPlans(d.membershipPlans ?? []));
  }, []);

  return (
    <div>
      <AdminPageHeader
        title="Membership Plans"
        description="View and manage pricing tiers offered at the gym."
      />
      <div className={shared.cardGrid}>
        {plans.map((plan) => (
          <div key={plan.id} className={shared.panel}>
            {plan.popular && (
              <span style={{ color: "var(--color-gold)", fontSize: "0.6875rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" }}>
                Most Popular
              </span>
            )}
            <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "1.25rem", margin: "0.5rem 0" }}>
              {plan.name}
            </h3>
            <p style={{ fontFamily: "var(--font-display)", fontSize: "2rem", color: "var(--color-gold)" }}>
              ₹{plan.price.toLocaleString("en-IN")}
            </p>
            <p style={{ fontSize: "0.8125rem", color: "var(--color-text-muted)", marginBottom: "1rem" }}>
              {plan.period}
              {plan.savings && ` · ${plan.savings}`}
            </p>
            <ul style={{ fontSize: "0.8125rem", color: "var(--color-text-muted)", display: "flex", flexDirection: "column", gap: "0.375rem" }}>
              {plan.features.slice(0, 4).map((f) => (
                <li key={f}>✓ {f}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

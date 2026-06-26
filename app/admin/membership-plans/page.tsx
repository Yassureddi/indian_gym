"use client";

import { useEffect, useState } from "react";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import PricingCard from "@/components/membership/PricingCard";
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
        {plans.map((plan, index) => (
          <PricingCard
            key={plan.id}
            plan={plan}
            index={index}
            showCta={false}
            animated={false}
          />
        ))}
      </div>
    </div>
  );
}

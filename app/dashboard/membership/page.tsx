"use client";

import { useEffect, useState } from "react";
import GlassCard from "@/components/ui/GlassCard";
import Button from "@/components/ui/Button";
import type { MemberMembership } from "@/lib/auth/types";
import styles from "./page.module.css";

export default function MembershipPage() {
  const [membership, setMembership] = useState<MemberMembership | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/membership")
      .then((res) => res.json())
      .then((data) => setMembership(data.membership ?? null))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <p className={styles.loading}>Loading membership...</p>;
  }

  return (
    <div className={styles.page}>
      <h2 className="text-h3">My Membership</h2>
      <p className={styles.subtitle}>View your current plan and validity.</p>

      {membership ? (
        <GlassCard hover={false} padding="lg" className={styles.card}>
          <div className={styles.badge} data-status={membership.status}>
            {membership.status}
          </div>
          <h3>{membership.planName}</h3>
          <dl className={styles.details}>
            <div>
              <dt>Start Date</dt>
              <dd>{new Date(membership.startDate).toLocaleDateString("en-IN")}</dd>
            </div>
            <div>
              <dt>End Date</dt>
              <dd>{new Date(membership.endDate).toLocaleDateString("en-IN")}</dd>
            </div>
            <div>
              <dt>Amount Paid</dt>
              <dd>₹{membership.amount.toLocaleString("en-IN")}</dd>
            </div>
          </dl>
        </GlassCard>
      ) : (
        <GlassCard hover={false} padding="lg" className={styles.card}>
          <h3>No Active Membership</h3>
          <p className={styles.emptyText}>
            You don&apos;t have an active membership yet. Visit the gym or contact us to get started.
          </p>
          <Button href="/membership" variant="primary" size="md">
            View Plans
          </Button>
        </GlassCard>
      )}
    </div>
  );
}

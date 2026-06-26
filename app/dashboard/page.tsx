"use client";

import { useEffect, useState } from "react";
import StatCard from "@/components/dashboard/StatCard";
import GlassCard from "@/components/ui/GlassCard";
import styles from "./page.module.css";

interface DashboardStats {
  membershipStatus: string;
  membershipPlan: string | null;
  workoutPlans: number;
  dietPlans: number;
  totalMembers?: number;
  totalUsers?: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [role, setRole] = useState<string>("member");

  useEffect(() => {
    fetch("/api/dashboard/stats")
      .then((res) => res.json())
      .then((data) => {
        setStats(data.stats);
        setRole(data.role);
      });
  }, []);

  if (!stats) {
    return <p className={styles.loading}>Loading overview...</p>;
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h2 className="text-h3">Dashboard Overview</h2>
        <p className={styles.subtitle}>
          Track your fitness journey, membership, and gym activity.
        </p>
      </div>

      {role === "admin" && (
        <div className={styles.stats}>
          <StatCard label="Total Members" value={stats.totalMembers ?? 0} />
          <StatCard label="Total Users" value={stats.totalUsers ?? 0} />
          <StatCard label="Workout Plans" value={stats.workoutPlans} />
          <StatCard label="Diet Plans" value={stats.dietPlans} />
        </div>
      )}

      {role === "member" && (
        <div className={styles.stats}>
          <StatCard
            label="Membership"
            value={stats.membershipPlan ?? "None"}
            hint={stats.membershipStatus}
          />
          <StatCard label="Workout Plans" value={stats.workoutPlans} />
          <StatCard label="Diet Plans" value={stats.dietPlans} />
          <StatCard label="Active Plans" value={stats.workoutPlans + stats.dietPlans} />
        </div>
      )}

      <div className={styles.grid}>
        <GlassCard hover={false} padding="lg" className={styles.card}>
          <h3>Quick Links</h3>
          <ul className={styles.links}>
            <li><a href="/dashboard/workout-plans">View Workout Plans</a></li>
            <li><a href="/dashboard/diet-plans">View Diet Plans</a></li>
            <li><a href="/dashboard/membership">Membership Details</a></li>
            <li><a href="/dashboard/profile">Edit Profile</a></li>
            {role === "admin" && <li><a href="/admin">Admin Panel</a></li>}
          </ul>
        </GlassCard>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import StatCard from "@/components/dashboard/StatCard";
import GlassCard from "@/components/ui/GlassCard";
import Button from "@/components/ui/Button";
import styles from "./page.module.css";

interface DashboardStats {
  totalVisits: number;
  thisMonthVisits: number;
  membershipStatus: string;
  membershipPlan: string | null;
  workoutPlans: number;
  dietPlans: number;
  checkedInToday: boolean;
  checkedOutToday: boolean;
  totalMembers?: number;
  totalUsers?: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [role, setRole] = useState<string>("member");
  const [attendanceLoading, setAttendanceLoading] = useState(false);
  const [message, setMessage] = useState("");

  const loadStats = () => {
    fetch("/api/dashboard/stats")
      .then((res) => res.json())
      .then((data) => {
        setStats(data.stats);
        setRole(data.role);
      });
  };

  useEffect(() => {
    loadStats();
  }, []);

  const handleAttendance = async (action: "check-in" | "check-out") => {
    setAttendanceLoading(true);
    setMessage("");
    try {
      const res = await fetch("/api/attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      setMessage(action === "check-in" ? "Checked in successfully!" : "Checked out successfully!");
      loadStats();
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setAttendanceLoading(false);
    }
  };

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
          <StatCard label="Your Visits" value={stats.totalVisits} />
          <StatCard label="This Month" value={stats.thisMonthVisits} />
        </div>
      )}

      {role === "member" && (
        <div className={styles.stats}>
          <StatCard label="Total Visits" value={stats.totalVisits} />
          <StatCard label="This Month" value={stats.thisMonthVisits} />
          <StatCard
            label="Membership"
            value={stats.membershipPlan ?? "None"}
            hint={stats.membershipStatus}
          />
          <StatCard label="Active Plans" value={stats.workoutPlans + stats.dietPlans} />
        </div>
      )}

      <div className={styles.grid}>
        <GlassCard hover={false} padding="lg" className={styles.card}>
          <h3>Today&apos;s Attendance</h3>
          <p className={styles.cardText}>
            {stats.checkedInToday
              ? stats.checkedOutToday
                ? "You've completed today's gym session."
                : "You're checked in. Don't forget to check out when you leave!"
              : "Mark your attendance when you arrive at the gym."}
          </p>
          {message && <p className={styles.message}>{message}</p>}
          <div className={styles.actions}>
            <Button
              variant="primary"
              size="md"
              disabled={stats.checkedInToday || attendanceLoading}
              onClick={() => handleAttendance("check-in")}
            >
              Check In
            </Button>
            <Button
              variant="outline"
              size="md"
              disabled={!stats.checkedInToday || stats.checkedOutToday || attendanceLoading}
              onClick={() => handleAttendance("check-out")}
            >
              Check Out
            </Button>
          </div>
        </GlassCard>

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

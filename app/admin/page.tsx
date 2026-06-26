"use client";

import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import AdminStatCard from "@/components/admin/AdminStatCard";
import AdminChartCard from "@/components/admin/AdminChartCard";
import RecentActivity from "@/components/admin/RecentActivity";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import type { ActivityItem } from "@/lib/admin/types";
import shared from "@/components/admin/admin-shared.module.css";
import styles from "./page.module.css";

const CHART_COLORS = ["#D4AF37", "#F0D78C", "#B8962E", "#8B7355", "#E8C547"];
const GOLD = "#D4AF37";

interface OverviewData {
  stats: {
    totalMembers: number;
    activeMemberships: number;
    monthlyRevenue: number;
    totalRevenue: number;
    pendingPayments: number;
  };
  charts: {
    revenue: { month: string; revenue: number }[];
    membershipDistribution: { name: string; value: number }[];
  };
  recentActivity: ActivityItem[];
}

const tooltipStyle = {
  background: "#111",
  border: "1px solid rgba(212,175,55,0.2)",
  borderRadius: "8px",
  fontSize: "12px",
};

export default function AdminDashboardPage() {
  const [data, setData] = useState<OverviewData | null>(null);

  useEffect(() => {
    fetch("/api/admin/overview")
      .then((r) => r.json())
      .then(setData);
  }, []);

  if (!data) {
    return <p className={styles.loading}>Loading dashboard...</p>;
  }

  const { stats, charts, recentActivity } = data;

  return (
    <div className={styles.page}>
      <AdminPageHeader
        title="Dashboard"
        description="Real-time overview of your gym operations, revenue, and member activity."
      />

      <div className={shared.grid3}>
        <AdminStatCard
          label="Total Members"
          value={stats.totalMembers}
          change="+12% this month"
          trend="up"
        />
        <AdminStatCard
          label="Active Memberships"
          value={stats.activeMemberships}
          change="Currently active"
          trend="neutral"
        />
        <AdminStatCard
          label="Total Revenue"
          value={`₹${stats.totalRevenue.toLocaleString("en-IN")}`}
          change="All time"
          trend="up"
        />
        <AdminStatCard
          label="Monthly Revenue"
          value={`₹${stats.monthlyRevenue.toLocaleString("en-IN")}`}
          change={`${stats.pendingPayments} pending`}
          trend={stats.pendingPayments > 0 ? "down" : "up"}
        />
      </div>

      <div className={styles.charts}>
        <AdminChartCard title="Revenue Trend" subtitle="Last 6 months">
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={charts.revenue}>
              <CartesianGrid stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis dataKey="month" stroke="#737373" fontSize={11} tickLine={false} />
              <YAxis
                stroke="#737373"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
              />
              <Tooltip
                contentStyle={tooltipStyle}
                formatter={(v) => [`₹${Number(v).toLocaleString("en-IN")}`, "Revenue"]}
              />
              <Bar dataKey="revenue" fill={GOLD} radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </AdminChartCard>
      </div>

      <div className={styles.bottom}>
        <AdminChartCard title="Membership Distribution" subtitle="By plan type">
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={charts.membershipDistribution}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={85}
                paddingAngle={3}
              >
                {charts.membershipDistribution.map((_, i) => (
                  <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} />
              <Legend wrapperStyle={{ fontSize: "12px" }} />
            </PieChart>
          </ResponsiveContainer>
        </AdminChartCard>

        <RecentActivity items={recentActivity} />
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminStatCard from "@/components/admin/AdminStatCard";
import AdminChartCard from "@/components/admin/AdminChartCard";
import shared from "@/components/admin/admin-shared.module.css";

const COLORS = ["#D4AF37", "#4ade80", "#60a5fa", "#f87171"];
const tooltipStyle = {
  background: "#111",
  border: "1px solid rgba(212,175,55,0.2)",
  borderRadius: "8px",
  fontSize: "12px",
};

export default function AdminAnalyticsPage() {
  const [data, setData] = useState<{
    analytics: {
      memberGrowth: number;
      activePlans: number;
      conversionRate: number;
      totalRevenue: number;
      revenue: { month: string; revenue: number }[];
      paymentMethods: { method: string; count: number }[];
      topPlans: { name: string; count: number }[];
      retentionRate: number;
    };
  } | null>(null);

  useEffect(() => {
    fetch("/api/admin/analytics")
      .then((r) => r.json())
      .then(setData);
  }, []);

  if (!data) return <p style={{ color: "var(--color-text-muted)" }}>Loading analytics...</p>;

  const { analytics } = data;

  return (
    <div>
      <AdminPageHeader
        title="Analytics"
        description="Deep insights into member behavior, revenue, and gym performance."
      />

      <div className={shared.grid3} style={{ marginBottom: "1.5rem" }}>
        <AdminStatCard label="Member Growth" value={analytics.memberGrowth} change="Total members" />
        <AdminStatCard label="Active Plans" value={analytics.activePlans} trend="up" />
        <AdminStatCard label="Conversion Rate" value={`${analytics.conversionRate}%`} trend="up" />
        <AdminStatCard
          label="Total Revenue"
          value={`₹${analytics.totalRevenue.toLocaleString("en-IN")}`}
          trend="up"
        />
      </div>

      <div className={shared.grid2}>
        <AdminChartCard title="Revenue Analytics" subtitle="6-month trend">
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={analytics.revenue}>
              <CartesianGrid stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis dataKey="month" stroke="#737373" fontSize={11} tickLine={false} />
              <YAxis stroke="#737373" fontSize={11} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={tooltipStyle}
                formatter={(v) => [`₹${Number(v).toLocaleString("en-IN")}`, "Revenue"]}
              />
              <Line type="monotone" dataKey="revenue" stroke="#D4AF37" strokeWidth={2} dot={{ fill: "#D4AF37" }} />
            </LineChart>
          </ResponsiveContainer>
        </AdminChartCard>

        <AdminChartCard title="Payment Methods" subtitle="Distribution by type">
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={analytics.paymentMethods}
                dataKey="count"
                nameKey="method"
                cx="50%"
                cy="50%"
                outerRadius={90}
              >
                {analytics.paymentMethods.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} />
            </PieChart>
          </ResponsiveContainer>
        </AdminChartCard>

        <AdminChartCard title="Top Plans" subtitle="Most popular memberships">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={analytics.topPlans} layout="vertical">
              <CartesianGrid stroke="rgba(255,255,255,0.05)" horizontal={false} />
              <XAxis type="number" stroke="#737373" fontSize={11} />
              <YAxis type="category" dataKey="name" stroke="#737373" fontSize={11} width={90} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="count" fill="#D4AF37" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </AdminChartCard>

        <div className={shared.panel}>
          <h3 style={{ fontFamily: "var(--font-heading)", marginBottom: "1rem" }}>Key Insights</h3>
          <ul style={{ display: "flex", flexDirection: "column", gap: "0.875rem", fontSize: "0.875rem", color: "var(--color-text-muted)" }}>
            <li>💰 Total revenue: <strong style={{ color: "var(--color-gold)" }}>₹{analytics.totalRevenue.toLocaleString("en-IN")}</strong></li>
            <li>📋 Active plans sold: <strong style={{ color: "var(--color-text)" }}>{analytics.activePlans}</strong></li>
            <li>📈 Conversion rate: <strong style={{ color: "#4ade80" }}>{analytics.conversionRate}%</strong></li>
            <li>🔄 Member retention: <strong style={{ color: "var(--color-gold)" }}>{analytics.retentionRate}%</strong></li>
          </ul>
        </div>
      </div>
    </div>
  );
}

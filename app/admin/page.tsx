"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
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
    todayStoreSales: number;
    todayStoreRevenue: number;
    monthlyStoreRevenue: number;
  };
  store: {
    bestSelling: { id: string; name: string; qty: number; revenue: number }[];
    lowStockProducts: { id: string; name: string; stock: number }[];
    recentSales: {
      id: string;
      invoiceNumber: string;
      customerName: string;
      grandTotal: number;
      paymentMethod: string;
      createdAt: string;
      soldByName: string;
    }[];
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

function formatDateTime(date: string) {
  return new Date(date).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function AdminDashboardPage() {
  const [data, setData] = useState<OverviewData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/overview", { credentials: "include" })
      .then(async (r) => {
        const json = await r.json();
        if (!r.ok || !json.stats) {
          throw new Error(json.error || "Failed to load dashboard");
        }
        setData(json);
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : "Failed to load dashboard");
      });
  }, []);

  if (error) {
    return (
      <div className={styles.errorPanel}>
        <p className={styles.loading}>{error}</p>
        <button
          type="button"
          className={styles.retryBtn}
          onClick={() => window.location.reload()}
        >
          Retry
        </button>
      </div>
    );
  }

  if (!data) {
    return <p className={styles.loading}>Loading dashboard...</p>;
  }

  const { stats, store, charts, recentActivity } = data;

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
          change="Membership payments"
          trend="up"
        />
        <AdminStatCard
          label="Monthly Revenue"
          value={`₹${stats.monthlyRevenue.toLocaleString("en-IN")}`}
          change={`${stats.pendingPayments} pending`}
          trend={stats.pendingPayments > 0 ? "down" : "up"}
        />
        <AdminStatCard
          label="Today's Store Sales"
          value={stats.todayStoreSales}
          change={`₹${stats.todayStoreRevenue.toLocaleString("en-IN")} revenue`}
          trend="up"
        />
        <AdminStatCard
          label="Monthly Store Revenue"
          value={`₹${stats.monthlyStoreRevenue.toLocaleString("en-IN")}`}
          change="In-store POS"
          trend="up"
        />
      </div>

      <div className={styles.storeSection}>
        <div className={styles.storeGrid}>
          <div className={`${shared.panel} ${styles.storePanel}`}>
            <div className={styles.panelHead}>
              <h3>Best Selling Supplements</h3>
              <Link href="/admin/store-sales">View all →</Link>
            </div>
            {store.bestSelling.length === 0 ? (
              <p className={styles.panelEmpty}>No store sales yet.</p>
            ) : (
              <ul className={styles.rankList}>
                {store.bestSelling.map((item, i) => (
                  <li key={item.id}>
                    <span className={styles.rank}>#{i + 1}</span>
                    <div>
                      <strong>{item.name}</strong>
                      <span>{item.qty} sold · ₹{item.revenue.toLocaleString("en-IN")}</span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className={`${shared.panel} ${styles.storePanel}`}>
            <div className={styles.panelHead}>
              <h3>Low Stock Products</h3>
              <Link href="/admin/supplements">Manage →</Link>
            </div>
            {store.lowStockProducts.length === 0 ? (
              <p className={styles.panelEmpty}>All products well stocked.</p>
            ) : (
              <ul className={styles.rankList}>
                {store.lowStockProducts.map((item) => (
                  <li key={item.id}>
                    <span className={`${styles.rank} ${styles.warn}`}>!</span>
                    <div>
                      <strong>{item.name}</strong>
                      <span>{item.stock} left in stock</span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className={`${shared.panel} ${styles.storePanel} ${styles.recentPanel}`}>
            <div className={styles.panelHead}>
              <h3>Recent Store Sales</h3>
              <Link href="/admin/store">Open Store →</Link>
            </div>
            {store.recentSales.length === 0 ? (
              <p className={styles.panelEmpty}>No recent sales.</p>
            ) : (
              <ul className={styles.salesList}>
                {store.recentSales.slice(0, 5).map((sale) => (
                  <li key={sale.id}>
                    <div>
                      <strong>{sale.invoiceNumber}</strong>
                      <span>{sale.customerName}</span>
                    </div>
                    <div className={styles.saleMeta}>
                      <strong>₹{sale.grandTotal.toLocaleString("en-IN")}</strong>
                      <span>{formatDateTime(sale.createdAt)}</span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
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

import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/session";
import { handleAuthError } from "@/lib/auth/api";
import { MEMBERSHIP_PLANS } from "@/lib/membership";
import { initializeDatabase } from "@/lib/db/init";
import { getActivity } from "@/lib/db/activity";
import { getPayments } from "@/lib/db/payments";
import { getMembers } from "@/lib/db/users";
import { getBlogs } from "@/lib/db/blogs";
import { getGalleryItems } from "@/lib/db/gallery";
import { getTrainers } from "@/lib/db/trainers";
import { getSupplements } from "@/lib/db/supplements";
import { getStoreSales, getStoreSalesStats } from "@/lib/db/store-sales";
import type { Payment } from "@/lib/admin/types";

function getMembershipDistribution(payments: Payment[]) {
  const counts: Record<string, number> = {};
  payments
    .filter((p) => p.status === "completed")
    .forEach((p) => {
      counts[p.planName] = (counts[p.planName] || 0) + 1;
    });
  return Object.entries(counts).map(([name, value]) => ({ name, value }));
}

function getMonthlyRevenue(payments: Payment[]) {
  const months: Record<string, number> = {};
  const labels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  for (let i = 5; i >= 0; i--) {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    months[key] = 0;
  }

  payments
    .filter((p) => p.status === "completed")
    .forEach((p) => {
      const key = p.date.slice(0, 7);
      if (key in months) months[key] += p.amount;
    });

  return Object.entries(months).map(([key, revenue]) => {
    const month = parseInt(key.split("-")[1], 10) - 1;
    return { month: labels[month], revenue };
  });
}

export async function GET() {
  try {
    await requireAdmin();
    await initializeDatabase();

    const [members, payments, activity, gallery, blogs, trainers, supplements, storeSales] =
      await Promise.all([
        getMembers(),
        getPayments(),
        getActivity(),
        getGalleryItems(),
        getBlogs(),
        getTrainers(),
        getSupplements(),
        getStoreSales(),
      ]);

    const storeStats = getStoreSalesStats(storeSales);
    const lowStockProducts = supplements
      .filter((s) => s.isActive && s.stockQuantity <= 5)
      .map((s) => ({
        id: s.id,
        name: s.name,
        stock: s.stockQuantity,
      }))
      .slice(0, 6);

    const now = new Date();
    const monthlyRevenue = payments
      .filter((p) => {
        if (p.status !== "completed") return false;
        const d = new Date(p.date);
        return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
      })
      .reduce((sum, p) => sum + p.amount, 0);

    const totalRevenue = payments
      .filter((p) => p.status === "completed")
      .reduce((sum, p) => sum + p.amount, 0);

    return NextResponse.json({
      stats: {
        totalMembers: members.length,
        activeMemberships: getMembershipDistribution(payments).reduce((s, p) => s + p.value, 0),
        monthlyRevenue,
        totalRevenue,
        pendingPayments: payments.filter((p) => p.status === "pending").length,
        galleryItems: gallery.length,
        blogPosts: blogs.length,
        trainers: trainers.length,
        todayStoreSales: storeStats.todaySalesCount,
        todayStoreRevenue: storeStats.todayRevenue,
        monthlyStoreRevenue: storeStats.monthlyRevenue,
      },
      store: {
        bestSelling: storeStats.bestSelling,
        lowStockProducts,
        recentSales: storeStats.recentSales.map((s) => ({
          id: s.id,
          invoiceNumber: s.invoiceNumber,
          customerName: s.customerName,
          grandTotal: s.grandTotal,
          paymentMethod: s.paymentMethod,
          createdAt: s.createdAt,
          soldByName: s.soldByName,
        })),
      },
      charts: {
        revenue: getMonthlyRevenue(payments),
        membershipDistribution: getMembershipDistribution(payments),
      },
      recentActivity: activity.slice(0, 8),
      membershipPlans: MEMBERSHIP_PLANS,
    });
  } catch (error) {
    return handleAuthError(error);
  }
}

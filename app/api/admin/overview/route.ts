import { NextResponse } from "next/server";
import { initializeDatabase } from "@/lib/db/init";
import { requireAdmin } from "@/lib/auth/session";
import { getUsers } from "@/lib/db/users";
import { getMemberships } from "@/lib/db/memberships";
import { getAttendance } from "@/lib/db/attendance";
import { getPayments, getMonthlyRevenue } from "@/lib/db/payments";
import { getActivity } from "@/lib/db/activity";
import { getNotifications } from "@/lib/db/notifications";
import { handleAuthError } from "@/lib/auth/api";
import { MEMBERSHIP_PLANS } from "@/lib/membership";
import { GALLERY_IMAGES } from "@/lib/gallery";
import { TRAINERS } from "@/lib/trainers";
import { BLOGS } from "@/lib/constants";

function getAttendanceChart(attendance: Awaited<ReturnType<typeof getAttendance>>) {
  const days: { day: string; visits: number }[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toISOString().split("T")[0];
    const label = d.toLocaleDateString("en-IN", { weekday: "short" });
    days.push({
      day: label,
      visits: attendance.filter((a) => a.date === key).length,
    });
  }
  return days;
}

function getMembershipDistribution(memberships: Awaited<ReturnType<typeof getMemberships>>) {
  const counts: Record<string, number> = {};
  memberships.forEach((m) => {
    counts[m.planName] = (counts[m.planName] || 0) + 1;
  });
  return Object.entries(counts).map(([name, value]) => ({ name, value }));
}

export async function GET() {
  try {
    await initializeDatabase();
    await requireAdmin();

    const [users, memberships, attendance, payments, activity, notifications] =
      await Promise.all([
        getUsers(),
        getMemberships(),
        getAttendance(),
        getPayments(),
        getActivity(),
        getNotifications(),
      ]);

    const members = users.filter((u) => u.role === "member");
    const today = new Date().toISOString().split("T")[0];
    const todayVisits = attendance.filter((a) => a.date === today).length;
    const activeMemberships = memberships.filter((m) => m.status === "active").length;
    const monthlyRevenue = payments
      .filter((p) => {
        if (p.status !== "completed") return false;
        const d = new Date(p.date);
        const now = new Date();
        return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
      })
      .reduce((sum, p) => sum + p.amount, 0);

    const unreadNotifications = notifications.filter((n) => !n.read).length;

    return NextResponse.json({
      stats: {
        totalMembers: members.length,
        activeMemberships,
        todayVisits,
        monthlyRevenue,
        totalRevenue: payments
          .filter((p) => p.status === "completed")
          .reduce((sum, p) => sum + p.amount, 0),
        pendingPayments: payments.filter((p) => p.status === "pending").length,
        galleryItems: GALLERY_IMAGES.length,
        blogPosts: BLOGS.length,
        trainers: TRAINERS.length,
        unreadNotifications,
      },
      charts: {
        attendance: getAttendanceChart(attendance),
        revenue: getMonthlyRevenue(payments),
        membershipDistribution: getMembershipDistribution(memberships),
      },
      recentActivity: activity.slice(0, 8),
      membershipPlans: MEMBERSHIP_PLANS,
    });
  } catch (error) {
    return handleAuthError(error);
  }
}

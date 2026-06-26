import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/session";
import { handleAuthError } from "@/lib/auth/api";
import { initializeDatabase } from "@/lib/db/init";
import { getMembers } from "@/lib/db/users";
import { getPayments, getMonthlyRevenue } from "@/lib/db/payments";

export async function GET() {
  try {
    await requireAdmin();
    await initializeDatabase();

    const members = await getMembers();
    const payments = await getPayments();

    const memberGrowth = members.length;
    const activePlans = payments.filter((p) => p.status === "completed").length;
    const conversionRate =
      members.length > 0 ? Math.round((activePlans / members.length) * 100) : 0;

    const totalRevenue = payments
      .filter((p) => p.status === "completed")
      .reduce((sum, p) => sum + p.amount, 0);

    const paymentMethods = ["upi", "cash", "card"].map((method) => ({
      method: method.toUpperCase(),
      count: payments.filter((p) => p.method === method).length,
    }));

    const topPlans = payments.reduce<Record<string, number>>((acc, p) => {
      acc[p.planName] = (acc[p.planName] || 0) + 1;
      return acc;
    }, {});

    return NextResponse.json({
      analytics: {
        memberGrowth,
        activePlans,
        conversionRate,
        totalRevenue,
        revenue: getMonthlyRevenue(payments),
        paymentMethods,
        topPlans: Object.entries(topPlans).map(([name, count]) => ({ name, count })),
        retentionRate: 78,
      },
    });
  } catch (error) {
    return handleAuthError(error);
  }
}

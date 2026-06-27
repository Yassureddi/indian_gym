import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/session";
import { handleAuthError, jsonError } from "@/lib/auth/api";
import { initializeDatabase } from "@/lib/db/init";
import { payMemberInstallment } from "@/lib/db/member-schedule-payment";
import { getMemberDetails } from "@/lib/db/member-details";
import type { BillingPeriod, MembershipCategory } from "@/lib/membership";

type RouteContext = { params: Promise<{ id: string }> };

export async function POST(request: NextRequest, context: RouteContext) {
  try {
    await requireAdmin();
    await initializeDatabase();

    const { id } = await context.params;
    const body = await request.json();

    const result = await payMemberInstallment({
      userId: id,
      dueDate: body.dueDate as string,
      planId: body.planId as BillingPeriod,
      categoryId: body.categoryId as MembershipCategory,
      paymentMethod: body.paymentMethod as "cash" | "upi",
      reference: body.reference,
    });

    if (!result.ok) {
      return jsonError(result.error, 400);
    }

    const details = await getMemberDetails(id);

    return NextResponse.json({
      membership: result.membership,
      payment: result.payment,
      details,
    });
  } catch (error) {
    return handleAuthError(error);
  }
}

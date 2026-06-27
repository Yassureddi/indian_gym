import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/session";
import { handleAuthError, jsonError } from "@/lib/auth/api";
import { initializeDatabase } from "@/lib/db/init";
import { renewMemberMembership } from "@/lib/db/member-renewal";
import { buildAdminMemberRow } from "@/lib/admin/members";
import { getUserById } from "@/lib/db/users";
import type { BillingPeriod, MembershipCategory } from "@/lib/membership";

type RouteContext = { params: Promise<{ id: string }> };

export async function POST(request: NextRequest, context: RouteContext) {
  try {
    await requireAdmin();
    await initializeDatabase();

    const { id } = await context.params;
    const body = await request.json();

    const planId = body.planId as BillingPeriod;
    const categoryId = body.categoryId as MembershipCategory;
    const paymentMethod = body.paymentMethod as "cash" | "upi";

    const result = await renewMemberMembership({
      userId: id,
      planId,
      categoryId,
      paymentMethod,
      reference: body.reference,
    });

    if (!result.ok) {
      return jsonError(result.error, 400);
    }

    const user = await getUserById(id);
    const member = user ? await buildAdminMemberRow(user) : null;

    return NextResponse.json({
      membership: result.membership,
      payment: result.payment,
      member,
    });
  } catch (error) {
    return handleAuthError(error);
  }
}

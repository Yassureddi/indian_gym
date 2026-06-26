import { NextRequest, NextResponse } from "next/server";
import { initializeDatabase } from "@/lib/db/init";
import { requireAdmin } from "@/lib/auth/session";
import { getPayments, savePayment } from "@/lib/db/payments";
import { logActivity } from "@/lib/db/activity";
import { createId } from "@/lib/db/store";
import { handleAuthError, jsonError } from "@/lib/auth/api";
import type { PaymentMethod, PaymentStatus } from "@/lib/admin/types";

export async function GET() {
  try {
    await initializeDatabase();
    await requireAdmin();
    const payments = await getPayments();
    return NextResponse.json({ payments });
  } catch (error) {
    return handleAuthError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    await initializeDatabase();
    await requireAdmin();

    const body = await request.json();
    const payment = {
      id: createId("pay"),
      userId: body.userId as string,
      memberName: (body.memberName as string).trim(),
      amount: Number(body.amount),
      method: body.method as PaymentMethod,
      status: (body.status as PaymentStatus) || "completed",
      planName: (body.planName as string).trim(),
      date: body.date || new Date().toISOString().split("T")[0],
      reference: body.reference as string | undefined,
    };

    if (!payment.memberName || !payment.amount || !payment.planName) {
      return jsonError("Member name, amount, and plan are required", 400);
    }

    await savePayment(payment);
    await logActivity(
      "payment",
      `Payment of ₹${payment.amount.toLocaleString("en-IN")} recorded for ${payment.memberName}`
    );

    return NextResponse.json({ payment }, { status: 201 });
  } catch (error) {
    return handleAuthError(error);
  }
}

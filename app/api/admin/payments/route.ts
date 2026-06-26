import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/session";
import { handleAuthError, jsonError } from "@/lib/auth/api";
import { initializeDatabase } from "@/lib/db/init";
import { createPayment, getPayments } from "@/lib/db/payments";
import { mapPayment } from "@/lib/api/mappers";
import type { Payment } from "@/lib/admin/types";

export async function GET() {
  try {
    await requireAdmin();
    await initializeDatabase();
    const payments = await getPayments();
    return NextResponse.json({ payments: payments.map(mapPayment) });
  } catch (error) {
    return handleAuthError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAdmin();
    await initializeDatabase();
    const body = await request.json();

    const payment = await createPayment({
      userId: body.userId ? String(body.userId) : "",
      membershipId: body.membershipId ? String(body.membershipId) : "",
      memberName: String(body.memberName).trim(),
      amount: Number(body.amount),
      method: body.method as Payment["method"],
      status: (body.status || "completed") as Payment["status"],
      planId: body.planId ? String(body.planId) : "",
      planName: String(body.planName).trim(),
      membershipDuration: body.membershipDuration ? String(body.membershipDuration) : "",
      date: body.date || new Date().toISOString().split("T")[0],
      reference: body.reference,
    });

    return NextResponse.json({ payment: mapPayment(payment) }, { status: 201 });
  } catch (error) {
    return handleAuthError(error);
  }
}

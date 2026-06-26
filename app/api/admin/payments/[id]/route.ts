import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/session";
import { handleAuthError, jsonError } from "@/lib/auth/api";
import { initializeDatabase } from "@/lib/db/init";
import { getPaymentDetails } from "@/lib/db/payment-details";
import { mapPayment } from "@/lib/api/mappers";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
    await initializeDatabase();
    const { id } = await params;

    const details = await getPaymentDetails(id);
    if (!details) {
      return jsonError("Payment not found", 404);
    }

    return NextResponse.json({
      ...details,
      payment: mapPayment(details.payment),
    });
  } catch (error) {
    return handleAuthError(error);
  }
}

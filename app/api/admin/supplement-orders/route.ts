import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/session";
import { handleAuthError } from "@/lib/auth/api";
import { initializeDatabase } from "@/lib/db/init";
import { getSupplementOrders } from "@/lib/db/supplement-orders";

export async function GET() {
  try {
    await requireAdmin();
    await initializeDatabase();
    const orders = await getSupplementOrders();
    return NextResponse.json({ orders });
  } catch (error) {
    return handleAuthError(error);
  }
}

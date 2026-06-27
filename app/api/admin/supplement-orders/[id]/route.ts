import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/session";
import { handleAuthError, jsonError } from "@/lib/auth/api";
import { initializeDatabase } from "@/lib/db/init";
import { updateSupplementOrderStatus } from "@/lib/db/supplement-orders";
import { SUPPLEMENT_ORDER_STATUSES, type SupplementOrderStatus } from "@/lib/supplements";

const STATUS_IDS = new Set(SUPPLEMENT_ORDER_STATUSES.map((s) => s.id));

type RouteContext = { params: Promise<{ id: string }> };

export async function PUT(request: NextRequest, context: RouteContext) {
  try {
    await requireAdmin();
    await initializeDatabase();

    const { id } = await context.params;
    const body = await request.json();
    const status = body.status as SupplementOrderStatus;

    if (!STATUS_IDS.has(status)) {
      return jsonError("Invalid order status", 400);
    }

    const order = await updateSupplementOrderStatus(id, status);
    if (!order) return jsonError("Order not found or cannot be updated", 404);

    return NextResponse.json({ order });
  } catch (error) {
    return handleAuthError(error);
  }
}

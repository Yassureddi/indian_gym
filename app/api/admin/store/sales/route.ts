import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/session";
import { handleAuthError, jsonError } from "@/lib/auth/api";
import { initializeDatabase } from "@/lib/db/init";
import { createStoreSale } from "@/lib/db/store-sales";

export async function POST(request: NextRequest) {
  try {
    const admin = await requireAdmin();
    await initializeDatabase();

    const body = await request.json();
    const items = body.items as { supplementId: string; quantity: number }[];
    const customerType = body.customerType as "member" | "walk_in";
    const paymentMethod = body.paymentMethod as "cash" | "upi";

    if (!Array.isArray(items) || items.length === 0) {
      return jsonError("Cart is empty", 400);
    }
    if (customerType !== "member" && customerType !== "walk_in") {
      return jsonError("Invalid customer type", 400);
    }
    if (paymentMethod !== "cash" && paymentMethod !== "upi") {
      return jsonError("Invalid payment method", 400);
    }

    const customerName = String(body.customerName ?? "").trim();
    const mobile = String(body.mobile ?? "").trim();
    if (!customerName) return jsonError("Customer name is required", 400);
    if (!mobile) return jsonError("Mobile number is required", 400);

    const result = await createStoreSale({
      items,
      customerType,
      memberId: body.memberId ? String(body.memberId) : undefined,
      customerName,
      mobile,
      paymentMethod,
      amountReceived:
        paymentMethod === "cash" && body.amountReceived != null
          ? Number(body.amountReceived)
          : undefined,
      soldById: admin.id,
      soldByName: admin.name,
    });

    if (!result.ok) return jsonError(result.error, 400);

    return NextResponse.json({ sale: result.sale }, { status: 201 });
  } catch (error) {
    return handleAuthError(error);
  }
}

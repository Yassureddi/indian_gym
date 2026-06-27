import { NextRequest, NextResponse } from "next/server";
import { jsonError } from "@/lib/auth/api";
import { initializeDatabase } from "@/lib/db/init";
import { createSupplementOrder } from "@/lib/db/supplement-orders";

export async function POST(request: NextRequest) {
  try {
    await initializeDatabase();
    const body = await request.json();

    const supplementId = String(body.supplementId ?? "").trim();
    const customerName = String(body.customerName ?? "").trim();
    const mobile = String(body.mobile ?? "").trim();
    const address = String(body.address ?? "").trim();
    const city = String(body.city ?? "").trim();
    const state = String(body.state ?? "").trim();
    const pincode = String(body.pincode ?? "").trim();
    const quantity = Number(body.quantity);
    const paymentMethod = body.paymentMethod as "cash" | "upi";
    const paymentReference =
      body.paymentReference != null ? String(body.paymentReference).trim() : undefined;

    if (!supplementId) return jsonError("Product is required", 400);
    if (!customerName) return jsonError("Customer name is required", 400);
    if (!mobile || mobile.replace(/\D/g, "").length < 10) {
      return jsonError("Valid mobile number is required", 400);
    }
    if (!address) return jsonError("Delivery address is required", 400);
    if (!city) return jsonError("City is required", 400);
    if (!state) return jsonError("State is required", 400);
    if (!pincode || pincode.length < 6) return jsonError("Valid pincode is required", 400);
    if (!Number.isFinite(quantity) || quantity < 1) {
      return jsonError("Quantity must be at least 1", 400);
    }
    if (paymentMethod !== "cash" && paymentMethod !== "upi") {
      return jsonError("Invalid payment method", 400);
    }
    if (paymentMethod === "upi" && !paymentReference) {
      return jsonError("UPI transaction reference is required", 400);
    }

    const result = await createSupplementOrder({
      supplementId,
      customerName,
      mobile,
      address,
      city,
      state,
      pincode,
      quantity,
      paymentMethod,
      paymentReference,
    });

    if (!result.ok) {
      return jsonError(result.error, 400);
    }

    return NextResponse.json({ order: result.order }, { status: 201 });
  } catch {
    return jsonError("Failed to create order", 500);
  }
}

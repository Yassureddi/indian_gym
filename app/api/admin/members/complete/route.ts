import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/session";
import { handleAuthError, jsonError } from "@/lib/auth/api";
import { initializeDatabase } from "@/lib/db/init";
import { completeMemberRegistration } from "@/lib/db/member-onboarding";
import { mapPayment, mapUser } from "@/lib/api/mappers";
import type { BillingPeriod, MembershipCategory } from "@/lib/membership";

export async function POST(request: NextRequest) {
  try {
    await requireAdmin();
    await initializeDatabase();
    const body = await request.json();

    const {
      name,
      email,
      phone,
      password,
      goal,
      gender,
      age,
      planId,
      categoryId,
      paymentMethod,
      reference,
    } = body;

    if (
      !name ||
      !email ||
      !phone ||
      !password ||
      !gender ||
      !age ||
      !planId ||
      !categoryId ||
      !paymentMethod
    ) {
      return jsonError(
        "Name, email, phone, password, gender, age, plan, category, and payment method are required",
        400
      );
    }

    if (paymentMethod !== "cash" && paymentMethod !== "upi") {
      return jsonError("Payment method must be cash or UPI", 400);
    }

    const parsedAge = Number(age);
    if (!Number.isFinite(parsedAge) || parsedAge < 1 || parsedAge > 120) {
      return jsonError("Please enter a valid age", 400);
    }

    const result = await completeMemberRegistration({
      name: String(name),
      email: String(email),
      phone: String(phone),
      password: String(password),
      goal: goal ? String(goal) : undefined,
      gender: String(gender),
      age: parsedAge,
      planId: planId as BillingPeriod,
      categoryId: categoryId as MembershipCategory,
      paymentMethod,
      reference: reference ? String(reference) : undefined,
    });

    if (!result.ok) {
      return jsonError(result.error, 400);
    }

    const { user, membership, payment } = result.result;
    return NextResponse.json(
      {
        user: mapUser(user),
        membership,
        payment: mapPayment(payment),
      },
      { status: 201 }
    );
  } catch (error) {
    return handleAuthError(error);
  }
}

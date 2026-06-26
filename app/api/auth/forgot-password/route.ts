import { NextRequest, NextResponse } from "next/server";
import { jsonError } from "@/lib/auth/api";
import { requestPasswordReset } from "@/lib/auth/auth-service";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const login = (body.login as string)?.trim();

    if (!login) {
      return jsonError("Email or phone is required", 400);
    }

    if (!login.includes("@")) {
      return NextResponse.json({
        message: "If an account exists, a reset link has been generated.",
      });
    }

    const result = await requestPasswordReset(login.toLowerCase());
    return NextResponse.json(result);
  } catch {
    return jsonError("Failed to process request", 500);
  }
}

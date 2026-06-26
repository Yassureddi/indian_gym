import { NextRequest, NextResponse } from "next/server";
import { jsonError } from "@/lib/auth/api";
import { resetUserPassword } from "@/lib/auth/auth-service";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const token = (body.token as string)?.trim();
    const password = body.password as string;

    if (!token || !password) {
      return jsonError("Token and new password are required", 400);
    }

    const result = await resetUserPassword(token, password);
    if (!result.ok) {
      return jsonError(result.error, 400);
    }

    return NextResponse.json({ message: result.message });
  } catch {
    return jsonError("Failed to reset password", 500);
  }
}

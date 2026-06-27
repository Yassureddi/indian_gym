import { NextRequest, NextResponse } from "next/server";
import { setAuthCookie } from "@/lib/auth/cookies";
import { jsonError } from "@/lib/auth/api";
import { loginUser } from "@/lib/auth/auth-service";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = await loginUser(body);

    if (!result) {
      return jsonError("Invalid email/phone or password", 401);
    }

    await setAuthCookie(result.token, Boolean(body.rememberMe));
    return NextResponse.json({ user: result.user });
  } catch (error) {
    console.error("[auth/login]", error);
    return jsonError("Login failed", 500);
  }
}

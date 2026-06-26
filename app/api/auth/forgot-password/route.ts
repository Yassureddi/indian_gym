import { NextRequest, NextResponse } from "next/server";
import { initializeDatabase } from "@/lib/db/init";
import { getUserByEmail, getUserByPhone } from "@/lib/db/users";
import {
  createResetToken,
  saveResetToken,
} from "@/lib/db/reset-tokens";
import { jsonError } from "@/lib/auth/api";

export async function POST(request: NextRequest) {
  try {
    await initializeDatabase();

    const body = await request.json();
    const login = (body.login as string)?.trim();

    if (!login) {
      return jsonError("Email or phone is required", 400);
    }

    const user = login.includes("@")
      ? await getUserByEmail(login)
      : await getUserByPhone(login);

    if (!user) {
      return NextResponse.json({
        message: "If an account exists, a reset link has been generated.",
      });
    }

    const resetToken = createResetToken(user.id);
    await saveResetToken(resetToken);

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || request.nextUrl.origin;
    const resetUrl = `${baseUrl}/reset-password?token=${resetToken.token}`;

    return NextResponse.json({
      message: "If an account exists, a reset link has been generated.",
      resetUrl,
    });
  } catch {
    return jsonError("Failed to process request", 500);
  }
}

import { NextRequest, NextResponse } from "next/server";
import { initializeDatabase } from "@/lib/db/init";
import {
  getResetToken,
  deleteResetToken,
} from "@/lib/db/reset-tokens";
import { updateUser } from "@/lib/db/users";
import { hashPassword } from "@/lib/auth/password";
import { jsonError } from "@/lib/auth/api";

export async function POST(request: NextRequest) {
  try {
    await initializeDatabase();

    const body = await request.json();
    const token = (body.token as string)?.trim();
    const password = body.password as string;

    if (!token || !password) {
      return jsonError("Token and new password are required", 400);
    }

    if (password.length < 6) {
      return jsonError("Password must be at least 6 characters", 400);
    }

    const resetToken = await getResetToken(token);
    if (!resetToken) {
      return jsonError("Invalid or expired reset link", 400);
    }

    await updateUser(resetToken.userId, {
      passwordHash: await hashPassword(password),
    });
    await deleteResetToken(token);

    return NextResponse.json({ message: "Password updated successfully" });
  } catch {
    return jsonError("Failed to reset password", 500);
  }
}

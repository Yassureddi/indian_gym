import { NextRequest, NextResponse } from "next/server";
import { initializeDatabase } from "@/lib/db/init";
import { findUserByLogin } from "@/lib/db/users";
import { verifyPassword } from "@/lib/auth/password";
import { signToken } from "@/lib/auth/jwt";
import { setAuthCookie } from "@/lib/auth/cookies";
import { jsonError } from "@/lib/auth/api";

export async function POST(request: NextRequest) {
  try {
    await initializeDatabase();

    const body = await request.json();
    const login = (body.login as string)?.trim();
    const password = body.password as string;
    const rememberMe = Boolean(body.rememberMe);

    if (!login || !password) {
      return jsonError("Email/phone and password are required", 400);
    }

    const user = await findUserByLogin(login);
    if (!user) {
      return jsonError("Invalid credentials", 401);
    }

    const valid = await verifyPassword(password, user.passwordHash);
    if (!valid) {
      return jsonError("Invalid credentials", 401);
    }

    const token = await signToken(
      {
        sub: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      rememberMe ? "30d" : "1d"
    );

    await setAuthCookie(token, rememberMe);

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        phone: user.phone,
        name: user.name,
        role: user.role,
        goal: user.goal,
      },
    });
  } catch {
    return jsonError("Login failed", 500);
  }
}

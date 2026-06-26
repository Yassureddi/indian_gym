import { NextRequest, NextResponse } from "next/server";
import { initializeDatabase } from "@/lib/db/init";
import { requireAdmin } from "@/lib/auth/session";
import { getUsers, createUser, toSessionUser } from "@/lib/db/users";
import { handleAuthError, jsonError } from "@/lib/auth/api";

export async function GET() {
  try {
    await initializeDatabase();
    await requireAdmin();
    const users = await getUsers();
    return NextResponse.json({
      members: users
        .filter((u) => u.role === "member")
        .map(toSessionUser),
    });
  } catch (error) {
    return handleAuthError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    await initializeDatabase();
    await requireAdmin();

    const body = await request.json();
    const { name, email, phone, password, goal } = body;

    if (!name || !email || !phone || !password) {
      return jsonError("Name, email, phone, and password are required", 400);
    }

    const { getUserByEmail, getUserByPhone } = await import("@/lib/db/users");
    if (await getUserByEmail(email)) {
      return jsonError("Email already exists", 400);
    }
    if (await getUserByPhone(phone)) {
      return jsonError("Phone already exists", 400);
    }

    const user = await createUser({
      name,
      email,
      phone,
      password,
      role: "member",
      goal,
    });

    return NextResponse.json({ user: toSessionUser(user) }, { status: 201 });
  } catch (error) {
    return handleAuthError(error);
  }
}

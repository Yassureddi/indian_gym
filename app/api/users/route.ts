import { NextRequest, NextResponse } from "next/server";
import { getUsers, createUser } from "@/lib/db/users";
import { toSessionUser } from "@/lib/db/users";

export async function GET() {
  try {
    const users = await getUsers();
    const safeUsers = users.map((u) => toSessionUser(u));

    return NextResponse.json({ success: true, users: safeUsers });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch users";

    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const name = typeof body.name === "string" ? body.name.trim() : "";
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const password = typeof body.password === "string" ? body.password : "changeme123";
    const phone = typeof body.phone === "string" ? body.phone.trim() : "0000000000";

    if (!name || !email) {
      return NextResponse.json(
        { success: false, error: "name and email are required" },
        { status: 400 }
      );
    }

    const user = await createUser({
      name,
      email,
      phone,
      password,
      role: "member",
    });

    return NextResponse.json(
      { success: true, user: toSessionUser(user) },
      { status: 201 }
    );
  } catch (error) {
    if (
      error instanceof Error &&
      "code" in error &&
      (error as { code?: number }).code === 11000
    ) {
      return NextResponse.json(
        { success: false, error: "Email already exists" },
        { status: 409 }
      );
    }

    const message =
      error instanceof Error ? error.message : "Failed to create user";

    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}

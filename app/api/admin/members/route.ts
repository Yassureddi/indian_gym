import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/session";
import { handleAuthError, jsonError } from "@/lib/auth/api";
import { registerMember } from "@/lib/auth/auth-service";
import { initializeDatabase } from "@/lib/db/init";
import { getMembers } from "@/lib/db/users";
import { mapUser } from "@/lib/api/mappers";

export async function GET() {
  try {
    await requireAdmin();
    await initializeDatabase();
    const members = await getMembers();
    return NextResponse.json({ members: members.map(mapUser) });
  } catch (error) {
    return handleAuthError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAdmin();
    const body = await request.json();
    const { name, email, phone, password, goal } = body;

    if (!name || !email || !phone || !password) {
      return jsonError("Name, email, phone, and password are required", 400);
    }

    const result = await registerMember({ name, email, phone, password, goal });
    if (!result.ok) {
      return jsonError(result.error, 400);
    }

    return NextResponse.json({ user: result.user }, { status: 201 });
  } catch (error) {
    return handleAuthError(error);
  }
}

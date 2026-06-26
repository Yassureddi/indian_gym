import { NextRequest, NextResponse } from "next/server";
import { initializeDatabase } from "@/lib/db/init";
import { requireSession } from "@/lib/auth/session";
import { getMembershipByUserId, getMemberships } from "@/lib/db/memberships";
import { handleAuthError, jsonError } from "@/lib/auth/api";

export async function GET(request: NextRequest) {
  try {
    await initializeDatabase();
    const session = await requireSession();
    const userId = request.nextUrl.searchParams.get("userId");

    if (userId) {
      if (session.role !== "admin") {
        return jsonError("Forbidden", 403);
      }
      const membership = await getMembershipByUserId(userId);
      return NextResponse.json({ membership });
    }

    if (session.role === "admin") {
      const memberships = await getMemberships();
      return NextResponse.json({ memberships });
    }

    const membership = await getMembershipByUserId(session.id);
    return NextResponse.json({ membership });
  } catch (error) {
    return handleAuthError(error);
  }
}

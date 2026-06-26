import { NextRequest, NextResponse } from "next/server";
import { requireSession } from "@/lib/auth/session";
import { handleAuthError, jsonError } from "@/lib/auth/api";
import { initializeDatabase } from "@/lib/db/init";
import { getMembershipByUserId } from "@/lib/db/memberships";
import { mapMembership } from "@/lib/api/mappers";

export async function GET(request: NextRequest) {
  try {
    const session = await requireSession();
    await initializeDatabase();

    const userId = request.nextUrl.searchParams.get("userId");

    if (userId) {
      if (session.role !== "admin") {
        return jsonError("Forbidden", 403);
      }
      const membership = await getMembershipByUserId(userId);
      return NextResponse.json({ membership: mapMembership(membership) });
    }

    if (session.role === "admin") {
      return jsonError("Admin membership list is not available via this endpoint", 400);
    }

    const membership = await getMembershipByUserId(session.id);
    return NextResponse.json({ membership: mapMembership(membership) });
  } catch (error) {
    return handleAuthError(error);
  }
}

import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/session";
import { handleAuthError, jsonError } from "@/lib/auth/api";
import { initializeDatabase } from "@/lib/db/init";
import { getMemberDetails } from "@/lib/db/member-details";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: RouteContext) {
  try {
    await requireAdmin();
    await initializeDatabase();

    const { id } = await context.params;
    const details = await getMemberDetails(id);

    if (!details) {
      return jsonError("Member not found", 404);
    }

    return NextResponse.json(details);
  } catch (error) {
    return handleAuthError(error);
  }
}

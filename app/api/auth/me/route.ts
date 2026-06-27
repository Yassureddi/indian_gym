import { NextResponse } from "next/server";
import { jsonError } from "@/lib/auth/api";
import { getSession } from "@/lib/auth/session";
import { mapUser } from "@/lib/api/mappers";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return jsonError("Unauthorized", 401);
    }
    return NextResponse.json({ user: mapUser(session) });
  } catch (error) {
    console.error("[auth/me]", error);
    return jsonError("Failed to fetch session", 500);
  }
}

import { NextResponse } from "next/server";
import { initializeDatabase } from "@/lib/db/init";
import { getSession } from "@/lib/auth/session";
import { jsonError } from "@/lib/auth/api";

export async function GET() {
  try {
    await initializeDatabase();
    const session = await getSession();
    if (!session) {
      return jsonError("Unauthorized", 401);
    }
    return NextResponse.json({ user: session });
  } catch {
    return jsonError("Failed to fetch session", 500);
  }
}

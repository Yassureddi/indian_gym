import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/session";
import { handleAuthError } from "@/lib/auth/api";
import { initializeDatabase } from "@/lib/db/init";
import { clearAllNotifications } from "@/lib/db/notifications";

export async function POST() {
  try {
    await requireAdmin();
    await initializeDatabase();

    const cleared = await clearAllNotifications();
    return NextResponse.json({ cleared });
  } catch (error) {
    return handleAuthError(error);
  }
}

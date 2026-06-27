import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/session";
import { handleAuthError } from "@/lib/auth/api";
import { initializeDatabase } from "@/lib/db/init";
import { markAllNotificationsRead } from "@/lib/db/notifications";

export async function POST() {
  try {
    await requireAdmin();
    await initializeDatabase();

    const count = await markAllNotificationsRead();
    return NextResponse.json({ marked: count });
  } catch (error) {
    return handleAuthError(error);
  }
}

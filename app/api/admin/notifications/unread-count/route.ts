import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/session";
import { handleAuthError } from "@/lib/auth/api";
import { initializeDatabase } from "@/lib/db/init";
import {
  getUnreadNotificationCount,
  syncMembershipExpiryNotifications,
} from "@/lib/db/notifications";

export async function GET() {
  try {
    await requireAdmin();
    await initializeDatabase();
    await syncMembershipExpiryNotifications();

    const count = await getUnreadNotificationCount();
    return NextResponse.json({ unreadCount: count });
  } catch (error) {
    return handleAuthError(error);
  }
}

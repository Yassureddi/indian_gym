import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/session";
import { handleAuthError } from "@/lib/auth/api";
import { initializeDatabase } from "@/lib/db/init";
import {
  getNotifications,
  syncMembershipExpiryNotifications,
} from "@/lib/db/notifications";
import type { NotificationCategory } from "@/lib/admin/notification-types";

export async function GET(request: NextRequest) {
  try {
    await requireAdmin();
    await initializeDatabase();
    await syncMembershipExpiryNotifications();

    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");
    const search = searchParams.get("search")?.toLowerCase().trim() ?? "";
    const date = searchParams.get("date");
    const limitParam = searchParams.get("limit");
    const limit = limitParam ? Number(limitParam) : undefined;

    let items = await getNotifications();

    if (type && type !== "all") {
      items = items.filter((n) => n.type === (type as NotificationCategory));
    }

    if (search) {
      items = items.filter(
        (n) =>
          n.title.toLowerCase().includes(search) ||
          n.message.toLowerCase().includes(search) ||
          n.memberName?.toLowerCase().includes(search)
      );
    }

    if (date) {
      items = items.filter((n) => n.createdAt.slice(0, 10) === date);
    }

    if (limit && limit > 0) {
      items = items.slice(0, limit);
    }

    const unreadCount = (await getNotifications()).filter((n) => !n.read).length;

    return NextResponse.json({ notifications: items, unreadCount });
  } catch (error) {
    return handleAuthError(error);
  }
}

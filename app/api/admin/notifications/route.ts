import { NextRequest, NextResponse } from "next/server";
import { initializeDatabase } from "@/lib/db/init";
import { requireAdmin } from "@/lib/auth/session";
import {
  getNotifications,
  saveNotification,
  markNotificationRead,
} from "@/lib/db/notifications";
import { createId } from "@/lib/db/store";
import { handleAuthError, jsonError } from "@/lib/auth/api";

export async function GET() {
  try {
    await initializeDatabase();
    await requireAdmin();
    const notifications = await getNotifications();
    return NextResponse.json({ notifications });
  } catch (error) {
    return handleAuthError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    await initializeDatabase();
    await requireAdmin();

    const body = await request.json();

    if (body.action === "mark_read" && body.id) {
      await markNotificationRead(body.id as string);
      return NextResponse.json({ success: true });
    }

    const notification = {
      id: createId("notif"),
      title: (body.title as string).trim(),
      message: (body.message as string).trim(),
      type: body.type || "info",
      read: false,
      createdAt: new Date().toISOString(),
    };

    if (!notification.title || !notification.message) {
      return jsonError("Title and message are required", 400);
    }

    await saveNotification(notification);
    return NextResponse.json({ notification }, { status: 201 });
  } catch (error) {
    return handleAuthError(error);
  }
}

import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/session";
import { handleAuthError, jsonError } from "@/lib/auth/api";
import { initializeDatabase } from "@/lib/db/init";
import {
  deleteNotification,
  markNotificationRead,
  markNotificationUnread,
} from "@/lib/db/notifications";

type RouteContext = { params: Promise<{ id: string }> };

export async function PATCH(request: NextRequest, context: RouteContext) {
  try {
    await requireAdmin();
    await initializeDatabase();

    const { id } = await context.params;
    const body = await request.json();
    const read = Boolean(body.read);

    const notification = read
      ? await markNotificationRead(id)
      : await markNotificationUnread(id);

    if (!notification) {
      return jsonError("Notification not found", 404);
    }

    return NextResponse.json({ notification });
  } catch (error) {
    return handleAuthError(error);
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    await requireAdmin();
    await initializeDatabase();

    const { id } = await context.params;
    const deleted = await deleteNotification(id);

    if (!deleted) {
      return jsonError("Notification not found", 404);
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    return handleAuthError(error);
  }
}

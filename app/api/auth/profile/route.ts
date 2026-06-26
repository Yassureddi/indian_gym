import { NextRequest, NextResponse } from "next/server";
import { handleAuthError, jsonError } from "@/lib/auth/api";
import { requireSession } from "@/lib/auth/session";
import {
  changeUserPassword,
  getUserProfile,
  updateUserProfile,
} from "@/lib/auth/auth-service";
import { mapUser } from "@/lib/api/mappers";

export async function PATCH(request: NextRequest) {
  try {
    const session = await requireSession();
    const body = await request.json();

    if (body.name || body.goal !== undefined || body.phone || body.email) {
      const updated = await updateUserProfile(session.id, {
        name: body.name ? String(body.name).trim() : undefined,
        goal: body.goal !== undefined ? String(body.goal).trim() : undefined,
        phone: body.phone ? String(body.phone).trim() : undefined,
        email: body.email ? String(body.email).trim().toLowerCase() : undefined,
      });
      if (!updated) return jsonError("User not found", 404);
    }

    if (body.newPassword) {
      if (!body.currentPassword) {
        return jsonError("Current password is required", 400);
      }
      const result = await changeUserPassword(
        session.id,
        body.currentPassword,
        body.newPassword
      );
      if (!result.ok) return jsonError(result.error, 400);
    }

    const user = await getUserProfile(session.id);
    if (!user) return jsonError("User not found", 404);

    return NextResponse.json({ user: mapUser(user) });
  } catch (error) {
    return handleAuthError(error);
  }
}

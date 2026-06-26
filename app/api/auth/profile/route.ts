import { NextRequest, NextResponse } from "next/server";
import { initializeDatabase } from "@/lib/db/init";
import { requireSession } from "@/lib/auth/session";
import { updateUser, getUserByEmail, getUserByPhone, getUserById } from "@/lib/db/users";
import { hashPassword, verifyPassword } from "@/lib/auth/password";
import { handleAuthError, jsonError } from "@/lib/auth/api";

export async function PATCH(request: NextRequest) {
  try {
    await initializeDatabase();
    const session = await requireSession();
    const body = await request.json();

    const updates: {
      name?: string;
      phone?: string;
      email?: string;
      goal?: string;
      passwordHash?: string;
    } = {};

    if (body.name) updates.name = (body.name as string).trim();
    if (body.goal !== undefined) updates.goal = (body.goal as string).trim();
    if (body.phone) {
      const phone = (body.phone as string).trim();
      const existing = await getUserByPhone(phone);
      if (existing && existing.id !== session.id) {
        return jsonError("Phone number already in use", 400);
      }
      updates.phone = phone;
    }
    if (body.email) {
      const email = (body.email as string).trim().toLowerCase();
      const existing = await getUserByEmail(email);
      if (existing && existing.id !== session.id) {
        return jsonError("Email already in use", 400);
      }
      updates.email = email;
    }

    if (body.newPassword) {
      if (!body.currentPassword) {
        return jsonError("Current password is required", 400);
      }
      const fullUser = await getUserById(session.id);
      if (!fullUser) return jsonError("User not found", 404);

      const valid = await verifyPassword(
        body.currentPassword as string,
        fullUser.passwordHash
      );
      if (!valid) {
        return jsonError("Current password is incorrect", 400);
      }
      updates.passwordHash = await hashPassword(body.newPassword as string);
    }

    const updated = await updateUser(session.id, updates);
    if (!updated) {
      return jsonError("User not found", 404);
    }

    return NextResponse.json({
      user: {
        id: updated.id,
        email: updated.email,
        phone: updated.phone,
        name: updated.name,
        role: updated.role,
        goal: updated.goal,
      },
    });
  } catch (error) {
    return handleAuthError(error);
  }
}

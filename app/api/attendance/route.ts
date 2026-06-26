import { NextRequest, NextResponse } from "next/server";
import { initializeDatabase } from "@/lib/db/init";
import { requireSession } from "@/lib/auth/session";
import {
  getAttendanceByUserId,
  checkIn,
  checkOut,
  getTodayAttendance,
  getAttendance,
} from "@/lib/db/attendance";
import { handleAuthError, jsonError } from "@/lib/auth/api";

export async function GET(request: NextRequest) {
  try {
    await initializeDatabase();
    const session = await requireSession();
    const userId = request.nextUrl.searchParams.get("userId");

    if (userId && session.role === "admin") {
      const records = await getAttendanceByUserId(userId);
      return NextResponse.json({ records });
    }

    if (userId && session.role !== "admin") {
      return jsonError("Forbidden", 403);
    }

    if (session.role === "admin" && !userId) {
      const records = await getAttendance();
      return NextResponse.json({ records });
    }

    const records = await getAttendanceByUserId(session.id);
    const today = await getTodayAttendance(session.id);
    return NextResponse.json({ records, today });
  } catch (error) {
    return handleAuthError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    await initializeDatabase();
    const session = await requireSession();
    const body = await request.json();
    const action = body.action as "check-in" | "check-out";
    const targetUserId =
      session.role === "admin" && body.userId
        ? (body.userId as string)
        : session.id;

    if (body.userId && session.role !== "admin") {
      return jsonError("Forbidden", 403);
    }

    if (action === "check-in") {
      const record = await checkIn(targetUserId);
      return NextResponse.json({ record });
    }

    if (action === "check-out") {
      const record = await checkOut(targetUserId);
      if (!record) {
        return jsonError("No check-in found for today", 400);
      }
      return NextResponse.json({ record });
    }

    return jsonError("Invalid action", 400);
  } catch (error) {
    return handleAuthError(error);
  }
}

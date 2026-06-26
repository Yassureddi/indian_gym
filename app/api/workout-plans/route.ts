import { NextRequest, NextResponse } from "next/server";
import { initializeDatabase } from "@/lib/db/init";
import { requireSession } from "@/lib/auth/session";
import {
  getWorkoutPlansByUserId,
  getWorkoutPlans,
  saveWorkoutPlan,
} from "@/lib/db/workout-plans";
import { createId } from "@/lib/db/store";
import { handleAuthError, jsonError } from "@/lib/auth/api";

export async function GET(request: NextRequest) {
  try {
    await initializeDatabase();
    const session = await requireSession();
    const userId = request.nextUrl.searchParams.get("userId");

    if (userId) {
      if (session.role !== "admin") {
        return jsonError("Forbidden", 403);
      }
      const plans = await getWorkoutPlansByUserId(userId);
      return NextResponse.json({ plans });
    }

    if (session.role === "admin") {
      const plans = await getWorkoutPlans();
      return NextResponse.json({ plans });
    }

    const plans = await getWorkoutPlansByUserId(session.id);
    return NextResponse.json({ plans });
  } catch (error) {
    return handleAuthError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    await initializeDatabase();
    const session = await requireSession();

    if (session.role !== "admin") {
      return jsonError("Forbidden", 403);
    }

    const body = await request.json();
    const now = new Date().toISOString();

    const plan = {
      id: createId("wp"),
      userId: body.userId as string,
      title: (body.title as string).trim(),
      description: (body.description as string).trim(),
      exercises: body.exercises ?? [],
      assignedBy: session.id,
      createdAt: now,
      updatedAt: now,
    };

    await saveWorkoutPlan(plan);
    return NextResponse.json({ plan }, { status: 201 });
  } catch (error) {
    return handleAuthError(error);
  }
}

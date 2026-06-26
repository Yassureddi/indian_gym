import { NextResponse } from "next/server";
import { requireSession } from "@/lib/auth/session";
import { handleAuthError } from "@/lib/auth/api";
import { initializeDatabase } from "@/lib/db/init";
import { getMembershipByUserId } from "@/lib/db/memberships";
import { getMembers } from "@/lib/db/users";
import { getWorkoutPlansByUserId } from "@/lib/db/workout-plans";
import { getDietPlansByUserId } from "@/lib/db/diet-plans";

export async function GET() {
  try {
    const session = await requireSession();
    await initializeDatabase();

    const membership = await getMembershipByUserId(session.id);
    const workoutPlans = await getWorkoutPlansByUserId(session.id);
    const dietPlans = await getDietPlansByUserId(session.id);

    const stats = {
      membershipStatus: membership?.status ?? "none",
      membershipPlan: membership?.planName ?? null,
      workoutPlans: workoutPlans.length,
      dietPlans: dietPlans.length,
    };

    if (session.role === "admin") {
      const members = await getMembers();
      return NextResponse.json({
        stats: {
          ...stats,
          totalMembers: members.length,
          totalUsers: members.length + 1,
        },
        role: session.role,
      });
    }

    return NextResponse.json({ stats, role: session.role });
  } catch (error) {
    return handleAuthError(error);
  }
}

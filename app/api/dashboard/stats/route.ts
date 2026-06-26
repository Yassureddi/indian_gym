import { NextResponse } from "next/server";
import { initializeDatabase } from "@/lib/db/init";
import { requireSession } from "@/lib/auth/session";
import { getAttendanceByUserId, getTodayAttendance } from "@/lib/db/attendance";
import { getMembershipByUserId } from "@/lib/db/memberships";
import { getWorkoutPlansByUserId } from "@/lib/db/workout-plans";
import { getDietPlansByUserId } from "@/lib/db/diet-plans";
import { getUsers } from "@/lib/db/users";
import { handleAuthError } from "@/lib/auth/api";

export async function GET() {
  try {
    await initializeDatabase();
    const session = await requireSession();

    const [attendance, todayAttendance, membership, workoutPlans, dietPlans] =
      await Promise.all([
        getAttendanceByUserId(session.id),
        getTodayAttendance(session.id),
        getMembershipByUserId(session.id),
        getWorkoutPlansByUserId(session.id),
        getDietPlansByUserId(session.id),
      ]);

    const stats = {
      totalVisits: attendance.length,
      thisMonthVisits: attendance.filter((a) => {
        const d = new Date(a.date);
        const now = new Date();
        return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
      }).length,
      membershipStatus: membership?.status ?? "none",
      membershipPlan: membership?.planName ?? null,
      workoutPlans: workoutPlans.length,
      dietPlans: dietPlans.length,
      checkedInToday: Boolean(todayAttendance),
      checkedOutToday: Boolean(todayAttendance?.checkOut),
    };

    if (session.role === "admin") {
      const users = await getUsers();
      return NextResponse.json({
        stats: {
          ...stats,
          totalMembers: users.filter((u) => u.role === "member").length,
          totalUsers: users.length,
        },
        role: session.role,
      });
    }

    return NextResponse.json({ stats, role: session.role });
  } catch (error) {
    return handleAuthError(error);
  }
}

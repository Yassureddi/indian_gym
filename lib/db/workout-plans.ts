import { readJson, writeJson, createId } from "./store";
import type { WorkoutPlan } from "@/lib/auth/types";

const FILE = "workout-plans.json";

export async function getWorkoutPlans(): Promise<WorkoutPlan[]> {
  return readJson<WorkoutPlan[]>(FILE, []);
}

export async function getWorkoutPlansByUserId(
  userId: string
): Promise<WorkoutPlan[]> {
  const plans = await getWorkoutPlans();
  return plans
    .filter((p) => p.userId === userId)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function saveWorkoutPlan(plan: WorkoutPlan) {
  const plans = await getWorkoutPlans();
  const index = plans.findIndex((p) => p.id === plan.id);
  if (index >= 0) {
    plans[index] = plan;
  } else {
    plans.push(plan);
  }
  await writeJson(FILE, plans);
}

export async function ensureSeedWorkoutPlans() {
  const plans = await getWorkoutPlans();
  if (plans.length > 0) return;

  const now = new Date().toISOString();
  await saveWorkoutPlan({
    id: createId("wp"),
    userId: "user_member_demo",
    title: "Muscle Building — Week 1",
    description: "Full-body strength split focused on compound movements.",
    exercises: [
      { name: "Barbell Squat", sets: "4", reps: "8-10", notes: "Controlled tempo" },
      { name: "Bench Press", sets: "4", reps: "8-10" },
      { name: "Romanian Deadlift", sets: "3", reps: "10-12" },
      { name: "Lat Pulldown", sets: "3", reps: "12" },
      { name: "Plank", sets: "3", reps: "45 sec" },
    ],
    assignedBy: "user_admin_demo",
    createdAt: now,
    updatedAt: now,
  });
}

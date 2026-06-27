import WorkoutPlanModel from "@/models/WorkoutPlan";
import { ensureDb, toPlainList } from "./mongo-helpers";
import { createId } from "./store";
import type { WorkoutPlan } from "@/lib/auth/types";

export async function getWorkoutPlans(): Promise<WorkoutPlan[]> {
  await ensureDb();
  const docs = await WorkoutPlanModel.find().lean();
  return toPlainList<WorkoutPlan>(docs);
}

export async function getWorkoutPlansByUserId(
  userId: string
): Promise<WorkoutPlan[]> {
  await ensureDb();
  const docs = await WorkoutPlanModel.find({ userId })
    .sort({ createdAt: -1 })
    .lean();
  return toPlainList<WorkoutPlan>(docs);
}

export async function saveWorkoutPlan(plan: WorkoutPlan) {
  await ensureDb();
  await WorkoutPlanModel.findOneAndUpdate({ id: plan.id }, plan, {
    upsert: true,
    new: true,
  });
}

export async function ensureSeedWorkoutPlans() {
  await ensureDb();
  const count = await WorkoutPlanModel.countDocuments();
  if (count > 0) return;

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

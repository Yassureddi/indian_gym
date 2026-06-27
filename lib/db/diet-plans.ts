import DietPlanModel from "@/models/DietPlan";
import { ensureDb, toPlainList } from "./mongo-helpers";
import { createId } from "./store";
import type { DietPlan } from "@/lib/auth/types";

export async function getDietPlans(): Promise<DietPlan[]> {
  await ensureDb();
  const docs = await DietPlanModel.find().lean();
  return toPlainList<DietPlan>(docs);
}

export async function getDietPlansByUserId(
  userId: string
): Promise<DietPlan[]> {
  await ensureDb();
  const docs = await DietPlanModel.find({ userId })
    .sort({ createdAt: -1 })
    .lean();
  return toPlainList<DietPlan>(docs);
}

export async function saveDietPlan(plan: DietPlan) {
  await ensureDb();
  await DietPlanModel.findOneAndUpdate({ id: plan.id }, plan, {
    upsert: true,
    new: true,
  });
}

export async function ensureSeedDietPlans() {
  await ensureDb();
  const count = await DietPlanModel.countDocuments();
  if (count > 0) return;

  const now = new Date().toISOString();
  await saveDietPlan({
    id: createId("dp"),
    userId: "user_member_demo",
    title: "High Protein Muscle Gain",
    description: "Balanced Indian meals with adequate protein for lean muscle growth.",
    meals: [
      { time: "6:00 AM", items: "2 eggs, 2 brown bread, black coffee", calories: 320 },
      { time: "9:00 AM", items: "Oats with milk, banana, almonds", calories: 450 },
      { time: "1:00 PM", items: "Rice, dal, chicken curry, salad", calories: 650 },
      { time: "5:00 PM", items: "Protein shake, peanut butter sandwich", calories: 380 },
      { time: "8:30 PM", items: "Roti, paneer bhurji, vegetables", calories: 520 },
    ],
    assignedBy: "user_admin_demo",
    createdAt: now,
    updatedAt: now,
  });
}

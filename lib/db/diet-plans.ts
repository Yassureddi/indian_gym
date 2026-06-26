import { readJson, writeJson, createId } from "./store";
import type { DietPlan } from "@/lib/auth/types";

const FILE = "diet-plans.json";

export async function getDietPlans(): Promise<DietPlan[]> {
  return readJson<DietPlan[]>(FILE, []);
}

export async function getDietPlansByUserId(
  userId: string
): Promise<DietPlan[]> {
  const plans = await getDietPlans();
  return plans
    .filter((p) => p.userId === userId)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function saveDietPlan(plan: DietPlan) {
  const plans = await getDietPlans();
  const index = plans.findIndex((p) => p.id === plan.id);
  if (index >= 0) {
    plans[index] = plan;
  } else {
    plans.push(plan);
  }
  await writeJson(FILE, plans);
}

export async function ensureSeedDietPlans() {
  const plans = await getDietPlans();
  if (plans.length > 0) return;

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

import { readJson, writeJson, createId } from "@/lib/db/store";
import type { ActivityItem, ActivityType } from "@/lib/admin/types";

const FILE = "activity.json";
const MAX_ITEMS = 50;

export async function getActivity(): Promise<ActivityItem[]> {
  const items = await readJson<ActivityItem[]>(FILE, []);
  return items.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function logActivity(
  type: ActivityType,
  message: string,
  userId?: string
) {
  const items = await getActivity();
  items.unshift({
    id: createId("act"),
    type,
    message,
    userId,
    createdAt: new Date().toISOString(),
  });
  await writeJson(FILE, items.slice(0, MAX_ITEMS));
}

export async function ensureSeedActivity() {
  const items = await getActivity();
  if (items.length > 0) return;

  const now = Date.now();
  const seed: ActivityItem[] = [
    {
      id: createId("act"),
      type: "check_in",
      message: "Demo Member checked in at 6:30 AM",
      userId: "user_member_demo",
      createdAt: new Date(now - 1800000).toISOString(),
    },
    {
      id: createId("act"),
      type: "payment",
      message: "Payment of ₹8,500 received via UPI from Demo Member",
      userId: "user_member_demo",
      createdAt: new Date(now - 7200000).toISOString(),
    },
    {
      id: createId("act"),
      type: "plan_assigned",
      message: "Muscle Building workout plan assigned to Demo Member",
      userId: "user_member_demo",
      createdAt: new Date(now - 86400000).toISOString(),
    },
    {
      id: createId("act"),
      type: "member_joined",
      message: "New member Demo Member joined the gym",
      userId: "user_member_demo",
      createdAt: new Date(now - 172800000).toISOString(),
    },
    {
      id: createId("act"),
      type: "membership",
      message: "Half Yearly · Cardio + Strength Training membership activated for Demo Member",
      userId: "user_member_demo",
      createdAt: new Date(now - 259200000).toISOString(),
    },
  ];

  await writeJson(FILE, seed);
}

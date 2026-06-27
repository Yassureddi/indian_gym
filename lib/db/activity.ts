import ActivityModel from "@/models/Activity";
import { ensureDb, toPlainList } from "./mongo-helpers";
import { createId } from "./store";
import type { ActivityItem, ActivityType } from "@/lib/admin/types";

const MAX_ITEMS = 50;

export async function getActivity(): Promise<ActivityItem[]> {
  await ensureDb();
  const docs = await ActivityModel.find()
    .sort({ createdAt: -1 })
    .limit(MAX_ITEMS)
    .lean();
  return toPlainList<ActivityItem>(docs);
}

export async function logActivity(
  type: ActivityType,
  message: string,
  userId?: string
) {
  await ensureDb();
  await ActivityModel.create({
    id: createId("act"),
    type,
    message,
    userId,
    createdAt: new Date().toISOString(),
  });

  const count = await ActivityModel.countDocuments();
  if (count > MAX_ITEMS) {
    const oldest = await ActivityModel.find()
      .sort({ createdAt: 1 })
      .limit(count - MAX_ITEMS)
      .select("id")
      .lean();
    const ids = oldest.map((d) => d.id);
    await ActivityModel.deleteMany({ id: { $in: ids } });
  }
}

export async function ensureSeedActivity() {
  await ensureDb();
  const count = await ActivityModel.countDocuments();
  if (count > 0) return;

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

  await ActivityModel.insertMany(seed);
}

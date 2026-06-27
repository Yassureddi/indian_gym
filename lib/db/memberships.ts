import MembershipModel from "@/models/Membership";
import { ensureDb, toPlain, toPlainList } from "./mongo-helpers";
import { createId } from "./store";
import type { MemberMembership } from "@/lib/auth/types";

export async function getMemberships(): Promise<MemberMembership[]> {
  await ensureDb();
  const docs = await MembershipModel.find().lean();
  return toPlainList<MemberMembership>(docs);
}

export async function getMembershipById(
  id: string
): Promise<MemberMembership | null> {
  await ensureDb();
  const doc = await MembershipModel.findOne({ id }).lean();
  return toPlain<MemberMembership>(doc);
}

export async function getMembershipByUserId(
  userId: string
): Promise<MemberMembership | null> {
  const memberships = await getMembershipsForUser(userId);
  return (
    memberships.find((m) => m.status === "active") ??
    memberships[0] ??
    null
  );
}

export async function getMembershipsForUser(
  userId: string
): Promise<MemberMembership[]> {
  await ensureDb();
  const docs = await MembershipModel.find({ userId })
    .sort({ startDate: -1 })
    .lean();
  return toPlainList<MemberMembership>(docs);
}

export async function expireActiveMembershipsForUser(userId: string) {
  await ensureDb();
  await MembershipModel.updateMany(
    { userId, status: "active" },
    { $set: { status: "expired" } }
  );
}

export async function saveMembership(membership: MemberMembership) {
  await ensureDb();
  await MembershipModel.findOneAndUpdate(
    { id: membership.id },
    membership,
    { upsert: true, new: true }
  );
}

export async function ensureSeedMemberships() {
  await ensureDb();
  const count = await MembershipModel.countDocuments();
  if (count > 0) return;

  const start = new Date();
  const end = new Date();
  end.setMonth(end.getMonth() + 6);

  await saveMembership({
    id: "mem_demo_half_yearly",
    userId: "user_member_demo",
    planId: "half-yearly:cardio-strength",
    planName: "Half Yearly · Cardio + Strength Training",
    startDate: start.toISOString().split("T")[0],
    endDate: end.toISOString().split("T")[0],
    status: "active",
    amount: 8500,
  });
}

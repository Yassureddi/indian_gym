import { readJson, writeJson, createId } from "./store";
import type { MemberMembership } from "@/lib/auth/types";

const FILE = "memberships.json";

export async function getMemberships(): Promise<MemberMembership[]> {
  return readJson<MemberMembership[]>(FILE, []);
}

export async function getMembershipById(
  id: string
): Promise<MemberMembership | null> {
  const memberships = await getMemberships();
  return memberships.find((m) => m.id === id) ?? null;
}

export async function getMembershipByUserId(
  userId: string
): Promise<MemberMembership | null> {
  const memberships = await getMemberships();
  return (
    memberships.find((m) => m.userId === userId && m.status === "active") ??
    memberships.find((m) => m.userId === userId) ??
    null
  );
}

export async function saveMembership(membership: MemberMembership) {
  const memberships = await getMemberships();
  const index = memberships.findIndex((m) => m.id === membership.id);
  if (index >= 0) {
    memberships[index] = membership;
  } else {
    memberships.push(membership);
  }
  await writeJson(FILE, memberships);
}

export async function ensureSeedMemberships() {
  const memberships = await getMemberships();
  if (memberships.length > 0) return;

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

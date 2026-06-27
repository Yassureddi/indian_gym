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
  const memberships = await getMemberships();
  return memberships
    .filter((m) => m.userId === userId)
    .sort((a, b) => b.startDate.localeCompare(a.startDate));
}

export async function expireActiveMembershipsForUser(userId: string) {
  const memberships = await getMemberships();
  let changed = false;
  for (const membership of memberships) {
    if (membership.userId === userId && membership.status === "active") {
      membership.status = "expired";
      changed = true;
    }
  }
  if (changed) {
    await writeJson(FILE, memberships);
  }
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

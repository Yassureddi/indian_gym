import type { Payment } from "@/lib/admin/types";
import type { MemberMembership } from "@/lib/auth/types";
import type { AdminMemberDetails } from "@/lib/admin/member-types";
import { buildAdminMemberRow } from "@/lib/admin/members";
import { buildMembershipPaymentSchedule } from "@/lib/membership-schedule";
import { getMembershipsForUser } from "./memberships";
import { getPaymentsByUserId } from "./payments";
import { getUserById } from "./users";

export async function getMemberDetails(
  userId: string
): Promise<AdminMemberDetails | null> {
  const user = await getUserById(userId);
  if (!user || user.role !== "member") return null;

  const member = await buildAdminMemberRow(user);
  const memberships: MemberMembership[] = await getMembershipsForUser(userId);
  const payments: Payment[] = await getPaymentsByUserId(userId);

  const schedule = buildMembershipPaymentSchedule({
    joiningDate: user.joiningDate ?? member.joiningDate ?? "",
    currentPlanId: member.membership?.planId ?? "monthly:strength",
    payments,
  });

  return {
    member,
    memberships,
    payments,
    schedule,
  };
}

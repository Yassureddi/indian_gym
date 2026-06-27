import type { User } from "@/lib/auth/types";
import type { AdminMemberRow } from "@/lib/admin/member-types";
import { mapUser } from "@/lib/api/mappers";
import { getMembershipByUserId } from "@/lib/db/memberships";
import {
  getBillingPlanName,
  getMembershipDisplayStatus,
  getRemainingDays,
  getServiceNameFromPlanId,
} from "@/lib/membership-utils";

export async function buildAdminMemberRow(user: User): Promise<AdminMemberRow> {
  const membership = await getMembershipByUserId(user.id);
  const sessionUser = mapUser(user);

  if (!membership) {
    return { ...sessionUser, membership: null };
  }

  const remainingDays = getRemainingDays(membership.endDate);
  const displayStatus = getMembershipDisplayStatus(membership);

  return {
    ...sessionUser,
    membership: {
      id: membership.id,
      planId: membership.planId,
      planName: membership.planName,
      billingPlan: getBillingPlanName(membership.planId),
      serviceName: getServiceNameFromPlanId(membership.planId),
      startDate: membership.startDate,
      endDate: membership.endDate,
      status: membership.status,
      remainingDays,
      displayStatus,
      amount: membership.amount,
    },
  };
}

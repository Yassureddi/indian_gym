import type { PaymentDetails } from "@/lib/admin/types";
import type { BillingPeriod } from "@/lib/membership";
import { getPaymentById } from "./payments";
import { getMembershipById, getMembershipByUserId } from "./memberships";
import { getUserById } from "./users";
import { getMembershipDurationLabel } from "@/lib/membership-utils";

export async function getPaymentDetails(id: string): Promise<PaymentDetails | null> {
  const payment = await getPaymentById(id);
  if (!payment) return null;

  const user = await getUserById(payment.userId);
  if (!user) return null;

  const membership =
    (payment.membershipId ? await getMembershipById(payment.membershipId) : null) ??
    (await getMembershipByUserId(payment.userId));

  const membershipDuration =
    payment.membershipDuration ||
    (membership ? getMembershipDurationLabel(membership.planId as BillingPeriod) : "—");

  return {
    payment: {
      ...payment,
      membershipId: payment.membershipId ?? membership?.id ?? "",
      planId: payment.planId ?? membership?.planId ?? "",
      membershipDuration,
    },
    member: {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      gender: user.gender,
      age: user.age,
      joiningDate: user.joiningDate,
      goal: user.goal,
    },
    membership: membership
      ? {
          id: membership.id,
          planId: membership.planId,
          planName: membership.planName,
          startDate: membership.startDate,
          endDate: membership.endDate,
          membershipDuration,
          planPrice: membership.amount,
          status: membership.status,
        }
      : {
          id: "",
          planId: payment.planId ?? "",
          planName: payment.planName,
          startDate: payment.date,
          endDate: payment.date,
          membershipDuration,
          planPrice: payment.amount,
          status: "unknown",
        },
  };
}

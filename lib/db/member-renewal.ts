import type { BillingPeriod, MembershipCategory } from "@/lib/membership";
import type { Payment } from "@/lib/admin/types";
import type { MemberMembership } from "@/lib/auth/types";
import { createId } from "./store";
import {
  expireActiveMembershipsForUser,
  saveMembership,
} from "./memberships";
import { createPayment, getPaymentsByUserId } from "./payments";
import { getUserById } from "./users";
import { logActivity } from "./activity";
import {
  notifyMembershipRenewed,
  notifyPaymentCompleted,
} from "@/lib/notifications/events";
import {
  buildMembershipPaymentSchedule,
  getEarliestPayableInstallment,
} from "@/lib/membership-schedule";
import {
  calculateMembershipEndDate,
  getMembershipDurationLabel,
  isRenewalEnabled,
  MEMBERSHIP_RENEWAL_WINDOW_DAYS,
  resolvePlanSelection,
} from "@/lib/membership-utils";
import { getMembershipByUserId } from "./memberships";

export interface RenewMembershipInput {
  userId: string;
  planId: BillingPeriod;
  categoryId: MembershipCategory;
  paymentMethod: "cash" | "upi";
  reference?: string;
}

export async function renewMemberMembership(
  data: RenewMembershipInput
): Promise<
  | { ok: true; membership: MemberMembership; payment: Payment }
  | { ok: false; error: string }
> {
  const user = await getUserById(data.userId);
  if (!user || user.role !== "member") {
    return { ok: false, error: "Member not found" };
  }

  const selection = resolvePlanSelection(data.planId, data.categoryId);
  if (!selection) {
    return { ok: false, error: "Invalid membership plan selected" };
  }

  if (data.paymentMethod === "upi" && !data.reference?.trim()) {
    return { ok: false, error: "UPI transaction reference is required" };
  }

  const currentMembership = await getMembershipByUserId(data.userId);
  if (currentMembership && !isRenewalEnabled(currentMembership)) {
    return {
      ok: false,
      error: `Renewal is only available within ${MEMBERSHIP_RENEWAL_WINDOW_DAYS} days before expiry`,
    };
  }

  await expireActiveMembershipsForUser(data.userId);

  const startDate = new Date().toISOString().split("T")[0];
  const endDate = calculateMembershipEndDate(selection.compositeId, new Date(startDate));
  const duration = getMembershipDurationLabel(selection.compositeId);

  const payments = await getPaymentsByUserId(data.userId);
  const schedule = buildMembershipPaymentSchedule({
    joiningDate: user.joiningDate ?? startDate,
    currentPlanId: selection.compositeId,
    payments,
  });
  const payable = getEarliestPayableInstallment(schedule);

  const membership: MemberMembership = {
    id: createId("mem"),
    userId: user.id,
    planId: selection.compositeId,
    planName: selection.fullName,
    startDate,
    endDate,
    status: "active",
    amount: selection.price,
  };
  await saveMembership(membership);

  const payment = await createPayment({
    userId: user.id,
    membershipId: membership.id,
    memberName: user.name,
    amount: selection.price,
    method: data.paymentMethod,
    status: "completed",
    planId: selection.compositeId,
    planName: selection.fullName,
    membershipDuration: duration,
    date: startDate,
    dueDate: payable?.dueDate ?? startDate,
    reference: data.paymentMethod === "upi" ? data.reference!.trim() : undefined,
  });

  await logActivity(
    "membership",
    `Membership renewed: ${selection.fullName} for ${user.name} (expires ${endDate})`,
    user.id
  );
  await logActivity(
    "payment",
    `Renewal payment of ₹${selection.price.toLocaleString("en-IN")} via ${data.paymentMethod.toUpperCase()} from ${user.name}`,
    user.id
  );

  await notifyMembershipRenewed(user.id, user.name, membership.id);
  await notifyPaymentCompleted(
    user.id,
    user.name,
    payment.id,
    selection.price,
    data.paymentMethod,
    selection.billingName
  );

  return { ok: true, membership, payment };
}

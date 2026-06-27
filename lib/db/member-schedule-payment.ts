import type { BillingPeriod, MembershipCategory } from "@/lib/membership";
import type { Payment } from "@/lib/admin/types";
import type { MemberMembership } from "@/lib/auth/types";
import { createId } from "./store";
import {
  expireActiveMembershipsForUser,
  getMembershipByUserId,
  saveMembership,
} from "./memberships";
import { createPayment, getPaymentsByUserId } from "./payments";
import { getUserById } from "./users";
import { logActivity } from "./activity";
import { notifyPaymentCompleted } from "@/lib/notifications/events";
import {
  buildMembershipPaymentSchedule,
  getEarliestPayableInstallment,
} from "@/lib/membership-schedule";
import {
  calculateMembershipEndDate,
  getMembershipDurationLabel,
  resolvePlanSelection,
} from "@/lib/membership-utils";

export interface PayInstallmentInput {
  userId: string;
  dueDate: string;
  planId: BillingPeriod;
  categoryId: MembershipCategory;
  paymentMethod: "cash" | "upi";
  reference?: string;
}

export async function payMemberInstallment(
  data: PayInstallmentInput
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
  const payments = await getPaymentsByUserId(data.userId);
  const schedule = buildMembershipPaymentSchedule({
    joiningDate: user.joiningDate ?? "",
    currentPlanId: currentMembership?.planId ?? selection.compositeId,
    payments,
  });

  const payable = getEarliestPayableInstallment(schedule);
  if (!payable) {
    return { ok: false, error: "No pending installment to pay" };
  }

  if (payable.dueDate !== data.dueDate) {
    return {
      ok: false,
      error: `Please pay the earliest due installment first (${payable.dueDate})`,
    };
  }

  if (payable.status === "paid") {
    return { ok: false, error: "This installment is already paid" };
  }

  const paymentDate = new Date().toISOString().split("T")[0];
  let startDate: string;

  if (
    currentMembership &&
    currentMembership.status === "active" &&
    currentMembership.endDate > data.dueDate
  ) {
    startDate = currentMembership.endDate;
  } else {
    startDate = data.dueDate;
  }

  const endDate = calculateMembershipEndDate(
    selection.compositeId,
    new Date(startDate + "T00:00:00")
  );
  const duration = getMembershipDurationLabel(selection.compositeId);

  await expireActiveMembershipsForUser(data.userId);

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
    date: paymentDate,
    dueDate: data.dueDate,
    reference: data.paymentMethod === "upi" ? data.reference!.trim() : undefined,
  });

  await logActivity(
    "membership",
    `Installment paid (${data.dueDate}): ${selection.fullName} for ${user.name} (expires ${endDate})`,
    user.id
  );
  await logActivity(
    "payment",
    `Schedule payment of ₹${selection.price.toLocaleString("en-IN")} via ${data.paymentMethod.toUpperCase()} from ${user.name} (due ${data.dueDate})`,
    user.id
  );

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

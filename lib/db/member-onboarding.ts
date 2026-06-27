import type { BillingPeriod, MembershipCategory } from "@/lib/membership";
import type { Payment } from "@/lib/admin/types";
import type { MemberMembership, SessionUser } from "@/lib/auth/types";
import { createUser, getUserByEmail, getUserByPhone, toSessionUser } from "./users";
import { saveMembership } from "./memberships";
import { createPayment } from "./payments";
import { logActivity } from "./activity";
import {
  notifyMemberJoined,
  notifyMembershipRenewed,
  notifyPaymentCompleted,
} from "@/lib/notifications/events";
import { createId } from "./store";
import {
  calculateMembershipEndDate,
  getMembershipDurationLabel,
  resolvePlanSelection,
} from "@/lib/membership-utils";

export interface CompleteMemberRegistrationInput {
  name: string;
  email: string;
  phone: string;
  password: string;
  goal?: string;
  gender: string;
  age: number;
  planId: BillingPeriod;
  categoryId: MembershipCategory;
  paymentMethod: "cash" | "upi";
  reference?: string;
}

export interface CompleteMemberRegistrationResult {
  user: SessionUser;
  membership: MemberMembership;
  payment: Payment;
}

export async function completeMemberRegistration(
  data: CompleteMemberRegistrationInput
): Promise<{ ok: true; result: CompleteMemberRegistrationResult } | { ok: false; error: string }> {
  if (await getUserByEmail(data.email)) {
    return { ok: false, error: "Email already registered" };
  }
  if (await getUserByPhone(data.phone)) {
    return { ok: false, error: "Phone already registered" };
  }

  const selection = resolvePlanSelection(data.planId, data.categoryId);
  if (!selection) {
    return { ok: false, error: "Invalid service plan selected" };
  }

  if (data.paymentMethod === "upi" && !data.reference?.trim()) {
    return { ok: false, error: "UPI transaction reference is required" };
  }

  const joiningDate = new Date().toISOString().split("T")[0];
  const startDate = joiningDate;
  const endDate = calculateMembershipEndDate(selection.compositeId, new Date(startDate));
  const duration = getMembershipDurationLabel(selection.compositeId);

  const user = await createUser({
    name: data.name,
    email: data.email,
    phone: data.phone,
    password: data.password,
    role: "member",
    goal: data.goal,
    gender: data.gender,
    age: data.age,
    joiningDate,
  });

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

  const reference =
    data.paymentMethod === "upi"
      ? data.reference!.trim()
      : undefined;

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
    date: joiningDate,
    dueDate: joiningDate,
    reference,
  });

  await logActivity(
    "member_joined",
    `New member ${user.name} joined the gym`,
    user.id
  );
  await logActivity(
    "membership",
    `${selection.fullName} membership activated for ${user.name}`,
    user.id
  );
  await logActivity(
    "payment",
    `Payment of ₹${selection.price.toLocaleString("en-IN")} received via ${data.paymentMethod.toUpperCase()} from ${user.name}`,
    user.id
  );

  await notifyMemberJoined(user.id, user.name);
  await notifyPaymentCompleted(
    user.id,
    user.name,
    payment.id,
    selection.price,
    data.paymentMethod,
    selection.billingName
  );

  return {
    ok: true,
    result: {
      user: toSessionUser(user),
      membership,
      payment,
    },
  };
}

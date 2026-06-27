import type { Payment } from "@/lib/admin/types";
import type { BillingPeriod } from "@/lib/membership";
import {
  getBillingPeriod,
  getBillingPlanName,
  resolvePlanSelection,
} from "@/lib/membership-utils";

export type InstallmentStatus = "paid" | "upcoming" | "overdue";

export interface MembershipInstallment {
  installmentNo: number;
  dueDate: string;
  planId: string;
  planName: string;
  billingPlan: string;
  amount: number;
  status: InstallmentStatus;
  paymentDate?: string;
  paymentId?: string;
}

export interface PaymentScheduleSummary {
  nextDueDate: string | null;
  daysRemaining: number | null;
  nextStatus: InstallmentStatus | "none";
  installments: MembershipInstallment[];
}

const UPCOMING_INSTALLMENT_COUNT = 4;
const MAX_INSTALLMENTS = 48;

export function getBillingIntervalMonths(period: BillingPeriod): number {
  const map: Record<BillingPeriod, number> = {
    monthly: 1,
    quarterly: 3,
    "half-yearly": 6,
    yearly: 12,
  };
  return map[period];
}

export function getAnchorDay(joiningDate: string): number {
  return new Date(joiningDate + "T00:00:00").getDate();
}

export function addMonthsOnAnchorDay(
  baseIso: string,
  anchorDay: number,
  months: number
): string {
  const base = new Date(baseIso + "T00:00:00");
  const target = new Date(base.getFullYear(), base.getMonth() + months, 1);
  const daysInMonth = new Date(
    target.getFullYear(),
    target.getMonth() + 1,
    0
  ).getDate();
  target.setDate(Math.min(anchorDay, daysInMonth));
  return target.toISOString().split("T")[0];
}

export function getNextDueDate(
  currentDueIso: string,
  anchorDay: number,
  period: BillingPeriod
): string {
  return addMonthsOnAnchorDay(
    currentDueIso,
    anchorDay,
    getBillingIntervalMonths(period)
  );
}

function todayIso(): string {
  return new Date().toISOString().split("T")[0];
}

function resolveInstallmentPlan(
  planId: string,
  fallbackPlanId: string
): { planId: string; planName: string; billingPlan: string; amount: number } {
  const effectiveId = planId || fallbackPlanId;
  const selection = resolvePlanSelection(effectiveId);
  if (!selection) {
    return {
      planId: effectiveId,
      planName: effectiveId,
      billingPlan: effectiveId,
      amount: 0,
    };
  }
  return {
    planId: selection.compositeId,
    planName: selection.fullName,
    billingPlan: selection.billingName,
    amount: selection.price,
  };
}

function matchPaymentsToInstallments(
  installments: MembershipInstallment[],
  payments: Payment[]
): void {
  const completed = payments
    .filter((p) => p.status === "completed")
    .sort((a, b) =>
      (a.dueDate ?? a.date).localeCompare(b.dueDate ?? b.date)
    );
  const used = new Set<string>();

  for (const inst of installments) {
    const exact = completed.find(
      (p) =>
        !used.has(p.id) &&
        (p.dueDate === inst.dueDate || p.date === inst.dueDate)
    );
    if (!exact) continue;

    used.add(exact.id);
    inst.status = "paid";
    inst.paymentId = exact.id;
    inst.paymentDate = exact.date;
    const plan = resolvePlanSelection(exact.planId);
    if (plan) {
      inst.planId = exact.planId;
      inst.planName = exact.planName;
      inst.billingPlan = plan.billingName;
      inst.amount = exact.amount;
    }
  }

  const remaining = completed.filter((p) => !used.has(p.id));
  let ri = 0;
  for (const inst of installments) {
    if (inst.status === "paid") continue;
    if (ri >= remaining.length) break;

    const payment = remaining[ri++];
    used.add(payment.id);
    inst.status = "paid";
    inst.paymentId = payment.id;
    inst.paymentDate = payment.date;
    inst.planId = payment.planId;
    inst.planName = payment.planName;
    inst.amount = payment.amount;
    inst.billingPlan = getBillingPlanName(payment.planId);
  }
}

function applyInstallmentStatuses(installments: MembershipInstallment[]): void {
  const today = todayIso();
  for (const inst of installments) {
    if (inst.status === "paid") continue;
    inst.status = inst.dueDate > today ? "upcoming" : "overdue";
  }
}

export function buildMembershipPaymentSchedule(input: {
  joiningDate: string;
  currentPlanId: string;
  payments: Payment[];
}): PaymentScheduleSummary {
  const { joiningDate, currentPlanId, payments } = input;

  if (!joiningDate) {
    return {
      nextDueDate: null,
      daysRemaining: null,
      nextStatus: "none",
      installments: [],
    };
  }

  const period = getBillingPeriod(currentPlanId || "monthly:strength");
  const anchorDay = getAnchorDay(joiningDate);
  const defaultPlan = resolveInstallmentPlan(currentPlanId, "monthly:strength");

  const installments: MembershipInstallment[] = [];
  let dueDate = joiningDate;
  const today = todayIso();
  let reachedToday = dueDate >= today;

  for (let i = 0; i < MAX_INSTALLMENTS; i++) {
    const plan = resolveInstallmentPlan(currentPlanId, defaultPlan.planId);
    installments.push({
      installmentNo: i + 1,
      dueDate,
      planId: plan.planId,
      planName: plan.planName,
      billingPlan: plan.billingPlan,
      amount: plan.amount,
      status: "upcoming",
    });

    if (dueDate >= today) {
      reachedToday = true;
    }

    const futureCount = installments.filter((inst) => inst.dueDate > today).length;
    if (reachedToday && futureCount >= UPCOMING_INSTALLMENT_COUNT) {
      break;
    }

    dueDate = getNextDueDate(dueDate, anchorDay, period);
  }

  matchPaymentsToInstallments(installments, payments);
  applyInstallmentStatuses(installments);

  const nextUnpaid =
    installments.find((i) => i.status === "overdue") ??
    installments.find((i) => i.status === "upcoming") ??
    null;

  let daysRemaining: number | null = null;
  if (nextUnpaid) {
    const due = new Date(nextUnpaid.dueDate + "T00:00:00");
    const now = new Date(today + "T00:00:00");
    daysRemaining = Math.ceil((due.getTime() - now.getTime()) / 86400000);
  }

  return {
    nextDueDate: nextUnpaid?.dueDate ?? null,
    daysRemaining,
    nextStatus: nextUnpaid?.status ?? "none",
    installments,
  };
}

export function getEarliestPayableInstallment(
  schedule: PaymentScheduleSummary
): MembershipInstallment | null {
  return (
    schedule.installments.find((i) => i.status === "overdue") ??
    schedule.installments.find((i) => i.status === "upcoming") ??
    null
  );
}

import type { BillingPeriod, MembershipCategory } from "@/lib/membership";
import {
  MEMBERSHIP_PLANS,
  getPlanSelection,
  parsePlanCompositeId,
} from "@/lib/membership";

export function getBillingPeriod(planId: string): BillingPeriod {
  const parsed = parsePlanCompositeId(planId);
  if (parsed) return parsed.period;
  return planId as BillingPeriod;
}

export function getPlanById(planId: BillingPeriod) {
  return MEMBERSHIP_PLANS.find((p) => p.id === planId) ?? null;
}

export function resolvePlanSelection(planId: string, categoryId?: MembershipCategory) {
  const parsed = parsePlanCompositeId(planId);
  if (parsed) {
    return getPlanSelection(parsed.period, parsed.category);
  }
  if (categoryId) {
    return getPlanSelection(planId as BillingPeriod, categoryId);
  }
  return null;
}

export function getMembershipDurationLabel(planId: string): string {
  const period = getBillingPeriod(planId);
  const labels: Record<BillingPeriod, string> = {
    monthly: "1 Month",
    quarterly: "3 Months",
    "half-yearly": "6 Months",
    yearly: "12 Months",
  };
  return labels[period];
}

export function calculateMembershipEndDate(planId: string, startDate: Date): string {
  const period = getBillingPeriod(planId);
  const end = new Date(startDate);
  switch (period) {
    case "monthly":
      end.setMonth(end.getMonth() + 1);
      break;
    case "quarterly":
      end.setMonth(end.getMonth() + 3);
      break;
    case "half-yearly":
      end.setMonth(end.getMonth() + 6);
      break;
    case "yearly":
      end.setFullYear(end.getFullYear() + 1);
      break;
  }
  return end.toISOString().split("T")[0];
}

export function getRemainingDays(endDate: string, fromDate = new Date()): number {
  const end = new Date(endDate);
  end.setHours(0, 0, 0, 0);
  const today = new Date(fromDate);
  today.setHours(0, 0, 0, 0);
  return Math.ceil((end.getTime() - today.getTime()) / 86400000);
}

export function getServiceNameFromPlanId(planId: string): string {
  const parsed = parsePlanCompositeId(planId);
  if (!parsed) return "—";
  return getPlanSelection(parsed.period, parsed.category)?.categoryName ?? "—";
}

export function getBillingPlanName(planId: string): string {
  const parsed = parsePlanCompositeId(planId);
  if (!parsed) return planId;
  return getPlanSelection(parsed.period, parsed.category)?.billingName ?? planId;
}

/** Days before expiry when renewal is allowed, warnings appear, and badges show */
export const MEMBERSHIP_RENEWAL_WINDOW_DAYS = 2;

export type MembershipDisplayStatus = "active" | "expiring" | "expired" | "none";

export function getMembershipDisplayStatus(
  membership: { endDate: string; status: string } | null | undefined
): MembershipDisplayStatus {
  if (!membership) return "none";
  if (membership.status === "pending") return "active";
  const remaining = getRemainingDays(membership.endDate);
  if (membership.status === "expired" || remaining < 0) return "expired";
  if (remaining <= MEMBERSHIP_RENEWAL_WINDOW_DAYS) return "expiring";
  return "active";
}

export function isRenewalEnabled(
  membership: { endDate: string; status: string; displayStatus?: MembershipDisplayStatus } | null | undefined
): boolean {
  if (!membership) return true;
  const status = membership.displayStatus ?? getMembershipDisplayStatus(membership);
  return status === "expiring" || status === "expired" || status === "none";
}

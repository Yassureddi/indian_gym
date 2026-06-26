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

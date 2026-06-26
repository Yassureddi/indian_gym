export type BillingPeriod = "monthly" | "quarterly" | "half-yearly" | "yearly";

export type MembershipCategory = "strength" | "cardio-strength";

export const STRENGTH_FEATURES = [
  "Unlimited Strength Training",
  "Professional Trainer Guidance",
  "Free Fitness Assessment",
  "Access During Gym Timings",
  "Locker Facility",
] as const;

export const CARDIO_STRENGTH_FEATURES = [
  "Unlimited Strength Training",
  "Unlimited Cardio Access",
  "Professional Trainer Guidance",
  "Free Fitness Assessment",
  "Access During Gym Timings",
  "Locker Facility",
] as const;

export interface MembershipCategoryOption {
  id: MembershipCategory;
  name: string;
  price: number;
  features: readonly string[];
}

export interface MembershipPlan {
  id: BillingPeriod;
  name: string;
  period: string;
  popular: boolean;
  categories: MembershipCategoryOption[];
}

export const MEMBERSHIP_PLANS: MembershipPlan[] = [
  {
    id: "monthly",
    name: "Monthly",
    period: "per month",
    popular: false,
    categories: [
      {
        id: "strength",
        name: "Strength Training",
        price: 1500,
        features: STRENGTH_FEATURES,
      },
      {
        id: "cardio-strength",
        name: "Cardio + Strength Training",
        price: 2000,
        features: CARDIO_STRENGTH_FEATURES,
      },
    ],
  },
  {
    id: "quarterly",
    name: "Quarterly",
    period: "per 3 months",
    popular: false,
    categories: [
      {
        id: "strength",
        name: "Strength Training",
        price: 3500,
        features: STRENGTH_FEATURES,
      },
      {
        id: "cardio-strength",
        name: "Cardio + Strength Training",
        price: 4500,
        features: CARDIO_STRENGTH_FEATURES,
      },
    ],
  },
  {
    id: "half-yearly",
    name: "Half Yearly",
    period: "per 6 months",
    popular: true,
    categories: [
      {
        id: "strength",
        name: "Strength Training",
        price: 6500,
        features: STRENGTH_FEATURES,
      },
      {
        id: "cardio-strength",
        name: "Cardio + Strength Training",
        price: 8500,
        features: CARDIO_STRENGTH_FEATURES,
      },
    ],
  },
  {
    id: "yearly",
    name: "Yearly",
    period: "per year",
    popular: false,
    categories: [
      {
        id: "strength",
        name: "Strength Training",
        price: 12000,
        features: STRENGTH_FEATURES,
      },
      {
        id: "cardio-strength",
        name: "Cardio + Strength Training",
        price: 16000,
        features: CARDIO_STRENGTH_FEATURES,
      },
    ],
  },
];

export const PAYMENT_MODES = [
  {
    id: "upi",
    name: "UPI",
    description: "Pay instantly via Google Pay, PhonePe, Paytm, or any UPI app.",
    icon: "upi" as const,
  },
  {
    id: "cash",
    name: "Cash",
    description: "Visit our front desk and pay in cash. Receipt provided instantly.",
    icon: "cash" as const,
  },
];

export function buildPlanCompositeId(
  period: BillingPeriod,
  category: MembershipCategory
): string {
  return `${period}:${category}`;
}

export function parsePlanCompositeId(
  compositeId: string
): { period: BillingPeriod; category: MembershipCategory } | null {
  const [period, category] = compositeId.split(":");
  if (
    !period ||
    !category ||
    !MEMBERSHIP_PLANS.some((p) => p.id === period) ||
    !["strength", "cardio-strength"].includes(category)
  ) {
    return null;
  }
  return {
    period: period as BillingPeriod,
    category: category as MembershipCategory,
  };
}

export function getPlanSelection(period: BillingPeriod, category: MembershipCategory) {
  const plan = MEMBERSHIP_PLANS.find((p) => p.id === period);
  const categoryOption = plan?.categories.find((c) => c.id === category);
  if (!plan || !categoryOption) return null;

  return {
    period,
    category,
    compositeId: buildPlanCompositeId(period, category),
    billingName: plan.name,
    categoryName: categoryOption.name,
    fullName: `${plan.name} · ${categoryOption.name}`,
    price: categoryOption.price,
    features: categoryOption.features,
    periodLabel: plan.period,
    popular: plan.popular,
  };
}

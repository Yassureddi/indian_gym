export type BillingPeriod = "monthly" | "quarterly" | "half-yearly" | "yearly";

export interface MembershipPlan {
  id: BillingPeriod;
  name: string;
  period: string;
  price: number;
  originalPrice?: number;
  savings?: string;
  popular: boolean;
  features: string[];
}

export const MEMBERSHIP_PLANS: MembershipPlan[] = [
  {
    id: "monthly",
    name: "Monthly",
    period: "per month",
    price: 2999,
    popular: false,
    features: [
      "Unlimited gym floor access",
      "All group classes included",
      "Locker & shower facilities",
      "Air-conditioned training zones",
      "Ladies & gents separate areas",
      "Basic fitness assessment",
    ],
  },
  {
    id: "quarterly",
    name: "Quarterly",
    period: "per 3 months",
    price: 7999,
    originalPrice: 8997,
    savings: "Save 11%",
    popular: false,
    features: [
      "Everything in Monthly",
      "Sauna & steam room access",
      "Nutrition consultation (1 session)",
      "Priority class booking",
      "Free gym bag & towel",
      "Progress tracking app access",
    ],
  },
  {
    id: "half-yearly",
    name: "Half Yearly",
    period: "per 6 months",
    price: 14999,
    originalPrice: 17994,
    savings: "Save 17%",
    popular: true,
    features: [
      "Everything in Quarterly",
      "2 personal training sessions",
      "Body composition analysis",
      "Custom workout plan",
      "Guest pass (1 per month)",
      "Free protein shaker kit",
    ],
  },
  {
    id: "yearly",
    name: "Yearly",
    period: "per year",
    price: 24999,
    originalPrice: 35988,
    savings: "Save 31%",
    popular: false,
    features: [
      "Everything in Half Yearly",
      "8 personal training sessions",
      "24/7 gym access",
      "Guest passes (2 per month)",
      "Annual health checkup",
      "VIP locker & priority support",
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

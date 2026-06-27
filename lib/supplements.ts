export const SUPPLEMENT_CATEGORIES = [
  { id: "protein", label: "Protein" },
  { id: "creatine", label: "Creatine" },
  { id: "pre-workout", label: "Pre-Workout" },
  { id: "vitamins", label: "Vitamins" },
  { id: "mass-gainer", label: "Mass Gainer" },
  { id: "bcaa", label: "BCAA" },
  { id: "other", label: "Other" },
] as const;

export type SupplementCategory = (typeof SUPPLEMENT_CATEGORIES)[number]["id"];

export interface Supplement {
  id: string;
  name: string;
  brand: string;
  category: SupplementCategory;
  description: string;
  price: number;
  discountPrice?: number;
  stockQuantity: number;
  weight: string;
  flavor: string;
  benefits: string[];
  ingredients: string;
  usageInstructions: string;
  expiryDate: string;
  image: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export type SupplementOrderStatus =
  | "pending"
  | "confirmed"
  | "ready_for_pickup"
  | "delivered"
  | "cancelled";

export type SupplementPaymentMethod = "cash" | "upi";

export const SUPPLEMENT_ORDER_STATUSES: {
  id: SupplementOrderStatus;
  label: string;
}[] = [
  { id: "pending", label: "Pending" },
  { id: "confirmed", label: "Confirmed" },
  { id: "ready_for_pickup", label: "Ready for Pickup" },
  { id: "delivered", label: "Delivered" },
  { id: "cancelled", label: "Cancelled" },
];

export interface SupplementOrder {
  id: string;
  supplementId: string;
  productName: string;
  productImage: string;
  customerName: string;
  mobile: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  quantity: number;
  unitPrice: number;
  totalAmount: number;
  paymentMethod: SupplementPaymentMethod;
  paymentReference?: string;
  status: SupplementOrderStatus;
  createdAt: string;
  updatedAt: string;
}

export function getEffectivePrice(supplement: Pick<Supplement, "price" | "discountPrice">) {
  return supplement.discountPrice != null && supplement.discountPrice < supplement.price
    ? supplement.discountPrice
    : supplement.price;
}

export const LOW_STOCK_THRESHOLD = 5;

export function getStockStatus(stock: number) {
  if (stock <= 0) return "out_of_stock" as const;
  if (stock <= LOW_STOCK_THRESHOLD) return "low_stock" as const;
  return "in_stock" as const;
}

export function getCategoryLabel(category: SupplementCategory) {
  return SUPPLEMENT_CATEGORIES.find((c) => c.id === category)?.label ?? category;
}

export function formatOrderStatus(status: SupplementOrderStatus) {
  return SUPPLEMENT_ORDER_STATUSES.find((s) => s.id === status)?.label ?? status;
}

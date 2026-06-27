import type { SupplementPaymentMethod } from "@/lib/supplements";

export type StoreCustomerType = "member" | "walk_in";

export interface StoreSaleItem {
  supplementId: string;
  productName: string;
  brand: string;
  image: string;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
}

export interface StoreSale {
  id: string;
  invoiceNumber: string;
  customerType: StoreCustomerType;
  memberId?: string;
  customerName: string;
  mobile: string;
  items: StoreSaleItem[];
  totalItems: number;
  grandTotal: number;
  paymentMethod: SupplementPaymentMethod;
  amountReceived?: number;
  changeGiven?: number;
  soldById: string;
  soldByName: string;
  createdAt: string;
}

export interface CartLine {
  supplementId: string;
  name: string;
  brand: string;
  image: string;
  unitPrice: number;
  stock: number;
  quantity: number;
}

export type StoreSalesDateFilter = "today" | "week" | "month" | "all" | "custom";

export function getCustomerTypeLabel(type: StoreCustomerType) {
  return type === "member" ? "Member" : "Walk-in";
}

export function isToday(dateIso: string) {
  const d = new Date(dateIso);
  const now = new Date();
  return (
    d.getDate() === now.getDate() &&
    d.getMonth() === now.getMonth() &&
    d.getFullYear() === now.getFullYear()
  );
}

export function isThisWeek(dateIso: string) {
  const d = new Date(dateIso);
  const now = new Date();
  const start = new Date(now);
  start.setDate(now.getDate() - now.getDay());
  start.setHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setDate(start.getDate() + 7);
  return d >= start && d < end;
}

export function isThisMonth(dateIso: string) {
  const d = new Date(dateIso);
  const now = new Date();
  return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
}

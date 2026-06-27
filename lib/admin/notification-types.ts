export type NotificationCategory = "membership" | "payments" | "store" | "system";

export type NotificationPriority = "high" | "medium" | "low";

export interface Notification {
  id: string;
  type: NotificationCategory;
  title: string;
  message: string;
  memberId?: string;
  memberName?: string;
  relatedRecordId?: string;
  priority: NotificationPriority;
  read: boolean;
  createdAt: string;
  /** Prevents duplicate auto-generated alerts */
  dedupeKey?: string;
}

export const NOTIFICATION_FILTERS = [
  { id: "all", label: "All" },
  { id: "membership", label: "Membership" },
  { id: "payments", label: "Payments" },
  { id: "store", label: "Store" },
  { id: "system", label: "System" },
] as const;

export type NotificationFilterId = (typeof NOTIFICATION_FILTERS)[number]["id"];

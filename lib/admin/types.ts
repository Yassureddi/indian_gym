export type PaymentMethod = "upi" | "cash" | "card";
export type PaymentStatus = "completed" | "pending" | "failed";

export interface Payment {
  id: string;
  userId: string;
  memberName: string;
  amount: number;
  method: PaymentMethod;
  status: PaymentStatus;
  planName: string;
  date: string;
  reference?: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "alert";
  read: boolean;
  createdAt: string;
}

export type ActivityType =
  | "member_joined"
  | "payment"
  | "check_in"
  | "membership"
  | "plan_assigned";

export interface ActivityItem {
  id: string;
  type: ActivityType;
  message: string;
  userId?: string;
  createdAt: string;
}

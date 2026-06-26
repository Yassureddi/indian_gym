export type PaymentMethod = "upi" | "cash" | "card";
export type PaymentStatus = "completed" | "pending" | "failed";

export interface Payment {
  id: string;
  userId: string;
  membershipId: string;
  memberName: string;
  amount: number;
  method: PaymentMethod;
  status: PaymentStatus;
  planId: string;
  planName: string;
  membershipDuration: string;
  date: string;
  reference?: string;
}

export interface PaymentDetails {
  payment: Payment;
  member: {
    id: string;
    name: string;
    email: string;
    phone: string;
    gender?: string;
    age?: number;
    joiningDate?: string;
    goal?: string;
  };
  membership: {
    id: string;
    planId: string;
    planName: string;
    startDate: string;
    endDate: string;
    membershipDuration: string;
    planPrice: number;
    status: string;
  };
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

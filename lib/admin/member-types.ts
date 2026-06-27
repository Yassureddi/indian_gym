import type { SessionUser } from "@/lib/auth/types";
import type { MemberMembership } from "@/lib/auth/types";
import type { Payment } from "@/lib/admin/types";
import type { MembershipDisplayStatus } from "@/lib/membership-utils";
import type { PaymentScheduleSummary } from "@/lib/membership-schedule";

export interface AdminMemberMembership {
  id: string;
  planId: string;
  planName: string;
  billingPlan: string;
  serviceName: string;
  startDate: string;
  endDate: string;
  status: string;
  remainingDays: number;
  displayStatus: MembershipDisplayStatus;
  amount: number;
}

export interface AdminMemberRow extends SessionUser {
  membership: AdminMemberMembership | null;
}

export interface AdminMemberDetails {
  member: AdminMemberRow;
  memberships: MemberMembership[];
  payments: Payment[];
  schedule: PaymentScheduleSummary;
}

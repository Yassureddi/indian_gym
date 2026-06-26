import { type Document, type Model, Types } from "mongoose";
export type MembershipStatus = "active" | "expired" | "pending";
export interface IMembership {
    userId: Types.ObjectId;
    planId: string;
    planName: string;
    startDate: Date;
    endDate: Date;
    status: MembershipStatus;
    amount: number;
}
export interface IMembershipDocument extends IMembership, Document {
    createdAt: Date;
    updatedAt: Date;
}
export declare const Membership: Model<IMembershipDocument>;

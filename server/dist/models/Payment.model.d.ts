import { type Document, type Model, Types } from "mongoose";
export type PaymentMethod = "upi" | "cash" | "card";
export type PaymentStatus = "completed" | "pending" | "failed";
export interface IPayment {
    userId?: Types.ObjectId;
    memberName: string;
    amount: number;
    method: PaymentMethod;
    status: PaymentStatus;
    planName: string;
    date: Date;
    reference?: string;
}
export interface IPaymentDocument extends IPayment, Document {
    createdAt: Date;
    updatedAt: Date;
}
export declare const Payment: Model<IPaymentDocument>;

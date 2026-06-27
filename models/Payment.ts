import mongoose, { Schema, type Model } from "mongoose";
import type { Payment } from "@/lib/admin/types";
import { idField, schemaOptions } from "./schema";

const paymentSchema = new Schema<Payment>(
  {
    ...idField,
    userId: { type: String, required: true, index: true },
    membershipId: { type: String, required: true, index: true },
    memberName: { type: String, required: true },
    amount: { type: Number, required: true },
    method: { type: String, enum: ["upi", "cash", "card"], required: true },
    status: { type: String, enum: ["completed", "pending", "failed"], required: true },
    planId: { type: String, required: true },
    planName: { type: String, required: true },
    membershipDuration: { type: String, required: true },
    date: { type: String, required: true },
    dueDate: String,
    reference: String,
  },
  schemaOptions
);

paymentSchema.index({ dueDate: 1 });

const PaymentModel: Model<Payment> =
  mongoose.models.Payment || mongoose.model<Payment>("Payment", paymentSchema);

export default PaymentModel;

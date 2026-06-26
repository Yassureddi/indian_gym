import mongoose, { Schema, type Document, type Model, Types } from "mongoose";

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

const paymentSchema = new Schema<IPaymentDocument>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", index: true },
    memberName: { type: String, required: true, trim: true },
    amount: { type: Number, required: true, min: 0 },
    method: { type: String, enum: ["upi", "cash", "card"], required: true },
    status: {
      type: String,
      enum: ["completed", "pending", "failed"],
      default: "completed",
    },
    planName: { type: String, required: true, trim: true },
    date: { type: Date, required: true, default: Date.now },
    reference: String,
  },
  { timestamps: true }
);

export const Payment: Model<IPaymentDocument> =
  mongoose.models.Payment ||
  mongoose.model<IPaymentDocument>("Payment", paymentSchema);

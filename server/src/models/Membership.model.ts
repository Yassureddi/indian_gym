import mongoose, { Schema, type Document, type Model, Types } from "mongoose";

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

const membershipSchema = new Schema<IMembershipDocument>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    planId: { type: String, required: true },
    planName: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    status: {
      type: String,
      enum: ["active", "expired", "pending"],
      default: "active",
    },
    amount: { type: Number, required: true },
  },
  { timestamps: true }
);

export const Membership: Model<IMembershipDocument> =
  mongoose.models.Membership ||
  mongoose.model<IMembershipDocument>("Membership", membershipSchema);

import mongoose, { Schema, type Model } from "mongoose";
import type { MemberMembership } from "@/lib/auth/types";
import { idField, schemaOptions } from "./schema";

const membershipSchema = new Schema<MemberMembership>(
  {
    ...idField,
    userId: { type: String, required: true, index: true },
    planId: { type: String, required: true },
    planName: { type: String, required: true },
    startDate: { type: String, required: true },
    endDate: { type: String, required: true },
    status: { type: String, enum: ["active", "expired", "pending"], required: true },
    amount: { type: Number, required: true },
  },
  schemaOptions
);

membershipSchema.index({ userId: 1, status: 1 });
membershipSchema.index({ userId: 1, startDate: -1 });

const MembershipModel: Model<MemberMembership> =
  mongoose.models.Membership ||
  mongoose.model<MemberMembership>("Membership", membershipSchema);

export default MembershipModel;

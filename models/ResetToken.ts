import mongoose, { Schema, type Model } from "mongoose";
import type { ResetToken } from "@/lib/auth/types";
import { schemaOptions } from "./schema";

const resetTokenSchema = new Schema<ResetToken>(
  {
    token: { type: String, required: true, unique: true },
    userId: { type: String, required: true, index: true },
    expiresAt: { type: String, required: true },
  },
  schemaOptions
);

const ResetTokenModel: Model<ResetToken> =
  mongoose.models.ResetToken ||
  mongoose.model<ResetToken>("ResetToken", resetTokenSchema);

export default ResetTokenModel;

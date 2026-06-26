import mongoose, { Schema, type Document, type Model, Types } from "mongoose";

export interface IResetToken {
  token: string;
  userId: Types.ObjectId;
  expiresAt: Date;
}

export interface IResetTokenDocument extends IResetToken, Document {}

const resetTokenSchema = new Schema<IResetTokenDocument>(
  {
    token: { type: String, required: true, unique: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    expiresAt: { type: Date, required: true, index: { expires: 0 } },
  },
  { timestamps: true }
);

export const ResetToken: Model<IResetTokenDocument> =
  mongoose.models.ResetToken ||
  mongoose.model<IResetTokenDocument>("ResetToken", resetTokenSchema);

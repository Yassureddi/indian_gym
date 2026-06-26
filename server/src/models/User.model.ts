import mongoose, { Schema, type Document, type Model } from "mongoose";

export interface IUser {
  email: string;
  phone: string;
  name: string;
  passwordHash: string;
  role: "admin" | "member";
  avatar?: string;
  goal?: string;
  isActive: boolean;
}

export interface IUserDocument extends IUser, Document {
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUserDocument>(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone: { type: String, required: true, unique: true, trim: true },
    name: { type: String, required: true, trim: true },
    passwordHash: { type: String, required: true, select: false },
    role: { type: String, enum: ["admin", "member"], default: "member" },
    avatar: String,
    goal: String,
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

userSchema.index({ role: 1 });

export const User: Model<IUserDocument> =
  mongoose.models.User || mongoose.model<IUserDocument>("User", userSchema);

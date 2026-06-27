import mongoose, { Schema, type Model } from "mongoose";
import type { User } from "@/lib/auth/types";
import { idField, schemaOptions } from "./schema";

const userSchema = new Schema<User>(
  {
    ...idField,
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone: { type: String, required: true, trim: true, index: true },
    name: { type: String, required: true, trim: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ["admin", "member"], required: true },
    avatar: String,
    goal: String,
    gender: String,
    age: Number,
    joiningDate: String,
    createdAt: { type: String, required: true },
    updatedAt: { type: String, required: true },
  },
  schemaOptions
);

userSchema.index({ role: 1 });

const UserModel: Model<User> =
  mongoose.models.User || mongoose.model<User>("User", userSchema);

export default UserModel;

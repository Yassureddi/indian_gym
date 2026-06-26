import mongoose, { Schema } from "mongoose";
const userSchema = new Schema({
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone: { type: String, required: true, unique: true, trim: true },
    name: { type: String, required: true, trim: true },
    passwordHash: { type: String, required: true, select: false },
    role: { type: String, enum: ["admin", "member"], default: "member" },
    avatar: String,
    goal: String,
    isActive: { type: Boolean, default: true },
}, { timestamps: true });
userSchema.index({ role: 1 });
export const User = mongoose.models.User || mongoose.model("User", userSchema);

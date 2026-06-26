import mongoose, { Schema } from "mongoose";
const resetTokenSchema = new Schema({
    token: { type: String, required: true, unique: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    expiresAt: { type: Date, required: true, index: { expires: 0 } },
}, { timestamps: true });
export const ResetToken = mongoose.models.ResetToken ||
    mongoose.model("ResetToken", resetTokenSchema);

import mongoose, { Schema } from "mongoose";
const paymentSchema = new Schema({
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
}, { timestamps: true });
export const Payment = mongoose.models.Payment ||
    mongoose.model("Payment", paymentSchema);

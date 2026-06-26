import mongoose, { Schema } from "mongoose";
const membershipSchema = new Schema({
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
}, { timestamps: true });
export const Membership = mongoose.models.Membership ||
    mongoose.model("Membership", membershipSchema);

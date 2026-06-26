import mongoose, { Schema } from "mongoose";
const contactSchema = new Schema({
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    goal: String,
    message: { type: String, required: true, trim: true },
    status: {
        type: String,
        enum: ["new", "read", "replied", "archived"],
        default: "new",
    },
}, { timestamps: true });
contactSchema.index({ status: 1, createdAt: -1 });
export const Contact = mongoose.models.Contact ||
    mongoose.model("Contact", contactSchema);

import mongoose, { Schema } from "mongoose";
const trainerSchema = new Schema({
    name: { type: String, required: true, trim: true },
    role: { type: String, required: true },
    specialty: { type: String, required: true },
    experience: { type: String, required: true },
    image: { type: String, required: true },
    bio: { type: String, required: true },
    certificates: [String],
    social: {
        instagram: String,
        facebook: String,
        youtube: String,
    },
    isActive: { type: Boolean, default: true },
    sortOrder: { type: Number, default: 0 },
}, { timestamps: true });
export const Trainer = mongoose.models.Trainer ||
    mongoose.model("Trainer", trainerSchema);

import mongoose, { Schema } from "mongoose";
const gallerySchema = new Schema({
    src: { type: String, required: true },
    alt: { type: String, required: true, trim: true },
    category: {
        type: String,
        enum: ["gym", "workout", "equipment", "members", "events"],
        required: true,
    },
    tall: { type: Boolean, default: false },
    isPublished: { type: Boolean, default: true },
    sortOrder: { type: Number, default: 0 },
}, { timestamps: true });
gallerySchema.index({ category: 1, isPublished: 1 });
export const Gallery = mongoose.models.Gallery ||
    mongoose.model("Gallery", gallerySchema);

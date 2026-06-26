import mongoose, { Schema } from "mongoose";
const cmsContentSchema = new Schema({
    type: {
        type: String,
        required: true,
        enum: [
            "site-settings",
            "faq",
            "testimonial",
            "service",
            "transformation",
            "pricing-plan",
            "stat",
            "journey",
            "facility",
            "notification",
            "workout-plan",
            "diet-plan",
        ],
        index: true,
    },
    slug: { type: String, trim: true, index: true },
    title: { type: String, trim: true },
    data: { type: Schema.Types.Mixed, default: {} },
    isPublished: { type: Boolean, default: true },
    sortOrder: { type: Number, default: 0 },
}, { timestamps: true });
cmsContentSchema.index({ type: 1, isPublished: 1, sortOrder: 1 });
export const CmsContent = mongoose.models.CmsContent ||
    mongoose.model("CmsContent", cmsContentSchema);

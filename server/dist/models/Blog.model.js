import mongoose, { Schema } from "mongoose";
const blogSchema = new Schema({
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    excerpt: { type: String, required: true },
    content: { type: String, required: true },
    category: { type: String, required: true },
    image: { type: String, required: true },
    readTime: { type: String, default: "5 min" },
    publishedAt: { type: Date, default: Date.now },
    isPublished: { type: Boolean, default: true },
}, { timestamps: true });
export const Blog = mongoose.models.Blog || mongoose.model("Blog", blogSchema);

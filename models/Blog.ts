import mongoose, { Schema, type Model } from "mongoose";
import type { BlogItem } from "@/lib/blog";
import { idField, schemaOptions } from "./schema";

const blogSchema = new Schema<BlogItem>(
  {
    ...idField,
    slug: { type: String, required: true, index: true },
    title: { type: String, required: true },
    excerpt: { type: String, required: true },
    content: String,
    category: { type: String, required: true },
    image: { type: String, required: true },
    readTime: { type: String, required: true },
    date: { type: String, required: true },
    isPublished: Boolean,
  },
  schemaOptions
);

const BlogModel: Model<BlogItem> =
  mongoose.models.Blog || mongoose.model<BlogItem>("Blog", blogSchema);

export default BlogModel;

import mongoose, { Schema, type Document, type Model } from "mongoose";

export interface IBlog {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  image: string;
  readTime: string;
  publishedAt: Date;
  isPublished: boolean;
}

export interface IBlogDocument extends IBlog, Document {
  createdAt: Date;
  updatedAt: Date;
}

const blogSchema = new Schema<IBlogDocument>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    excerpt: { type: String, required: true },
    content: { type: String, required: true },
    category: { type: String, required: true },
    image: { type: String, required: true },
    readTime: { type: String, default: "5 min" },
    publishedAt: { type: Date, default: Date.now },
    isPublished: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Blog: Model<IBlogDocument> =
  mongoose.models.Blog || mongoose.model<IBlogDocument>("Blog", blogSchema);

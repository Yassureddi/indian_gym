import { type Document, type Model } from "mongoose";
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
export declare const Blog: Model<IBlogDocument>;

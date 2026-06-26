import { type Document, type Model } from "mongoose";
export type CmsType = "site-settings" | "faq" | "testimonial" | "service" | "transformation" | "pricing-plan" | "stat" | "journey" | "facility" | "notification" | "workout-plan" | "diet-plan";
export interface ICmsContent {
    type: CmsType;
    slug?: string;
    title?: string;
    data: Record<string, unknown>;
    isPublished: boolean;
    sortOrder: number;
}
export interface ICmsContentDocument extends ICmsContent, Document {
    createdAt: Date;
    updatedAt: Date;
}
export declare const CmsContent: Model<ICmsContentDocument>;

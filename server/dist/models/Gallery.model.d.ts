import { type Document, type Model } from "mongoose";
export type GalleryCategory = "gym" | "workout" | "equipment" | "members" | "events";
export interface IGallery {
    src: string;
    alt: string;
    category: GalleryCategory;
    tall?: boolean;
    isPublished: boolean;
    sortOrder: number;
}
export interface IGalleryDocument extends IGallery, Document {
    createdAt: Date;
    updatedAt: Date;
}
export declare const Gallery: Model<IGalleryDocument>;

import mongoose, { Schema, type Document, type Model } from "mongoose";

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

const gallerySchema = new Schema<IGalleryDocument>(
  {
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
  },
  { timestamps: true }
);

gallerySchema.index({ category: 1, isPublished: 1 });

export const Gallery: Model<IGalleryDocument> =
  mongoose.models.Gallery ||
  mongoose.model<IGalleryDocument>("Gallery", gallerySchema);

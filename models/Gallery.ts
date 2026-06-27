import mongoose, { Schema, type Model } from "mongoose";
import type { GalleryItem } from "@/lib/gallery";
import { idField, schemaOptions } from "./schema";

const gallerySchema = new Schema<GalleryItem>(
  {
    ...idField,
    src: { type: String, required: true },
    alt: { type: String, required: true },
    category: {
      type: String,
      enum: ["gym", "workout", "equipment", "members", "events"],
      required: true,
    },
    tall: Boolean,
    isPublished: Boolean,
    sortOrder: Number,
  },
  schemaOptions
);

const GalleryModel: Model<GalleryItem> =
  mongoose.models.Gallery || mongoose.model<GalleryItem>("Gallery", gallerySchema);

export default GalleryModel;

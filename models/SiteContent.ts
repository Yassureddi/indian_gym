import mongoose, { Schema, type Model } from "mongoose";
import type { SiteContent } from "@/lib/site-content.constants";
import { schemaOptions } from "./schema";

export interface SiteContentDoc extends SiteContent {
  key: string;
}

const siteContentSchema = new Schema<SiteContentDoc>(
  {
    key: { type: String, required: true, unique: true, default: "default" },
    aboutPreviewImage: String,
    aboutPreviewUpdatedAt: String,
  },
  schemaOptions
);

const SiteContentModel: Model<SiteContentDoc> =
  mongoose.models.SiteContent ||
  mongoose.model<SiteContentDoc>("SiteContent", siteContentSchema);

export default SiteContentModel;

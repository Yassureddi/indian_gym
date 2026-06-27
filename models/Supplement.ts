import mongoose, { Schema, type Model } from "mongoose";
import type { Supplement } from "@/lib/supplements";
import { idField, schemaOptions } from "./schema";

const supplementSchema = new Schema<Supplement>(
  {
    ...idField,
    name: { type: String, required: true },
    brand: { type: String, required: true },
    category: { type: String, required: true, index: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    discountPrice: Number,
    stockQuantity: { type: Number, required: true },
    weight: { type: String, required: true },
    flavor: { type: String, required: true },
    benefits: [String],
    ingredients: { type: String, required: true },
    usageInstructions: { type: String, required: true },
    expiryDate: { type: String, required: true },
    image: { type: String, required: true },
    isActive: { type: Boolean, required: true, index: true },
    createdAt: { type: String, required: true },
    updatedAt: { type: String, required: true },
  },
  schemaOptions
);

const SupplementModel: Model<Supplement> =
  mongoose.models.Supplement ||
  mongoose.model<Supplement>("Supplement", supplementSchema);

export default SupplementModel;

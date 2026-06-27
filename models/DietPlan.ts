import mongoose, { Schema, type Model } from "mongoose";
import type { DietPlan } from "@/lib/auth/types";
import { idField, schemaOptions } from "./schema";

const dietMealSchema = new Schema(
  {
    time: { type: String, required: true },
    items: { type: String, required: true },
    calories: Number,
  },
  { _id: false }
);

const dietPlanSchema = new Schema<DietPlan>(
  {
    ...idField,
    userId: { type: String, required: true, index: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    meals: [dietMealSchema],
    assignedBy: String,
    createdAt: { type: String, required: true },
    updatedAt: { type: String, required: true },
  },
  schemaOptions
);

dietPlanSchema.index({ userId: 1, createdAt: -1 });

const DietPlanModel: Model<DietPlan> =
  mongoose.models.DietPlan || mongoose.model<DietPlan>("DietPlan", dietPlanSchema);

export default DietPlanModel;

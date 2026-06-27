import mongoose, { Schema, type Model } from "mongoose";
import type { Trainer } from "@/lib/trainers";
import { idField, schemaOptions } from "./schema";

const trainerSocialSchema = new Schema(
  {
    instagram: String,
    facebook: String,
    youtube: String,
  },
  { _id: false }
);

const trainerSchema = new Schema<Trainer>(
  {
    ...idField,
    name: { type: String, required: true },
    role: { type: String, required: true },
    specialty: { type: String, required: true },
    experience: { type: String, required: true },
    image: { type: String, required: true },
    bio: { type: String, required: true },
    certificates: [String],
    social: { type: trainerSocialSchema, default: {} },
    age: Number,
    dob: String,
    purpose: String,
    isActive: Boolean,
    sortOrder: Number,
  },
  schemaOptions
);

const TrainerModel: Model<Trainer> =
  mongoose.models.Trainer || mongoose.model<Trainer>("Trainer", trainerSchema);

export default TrainerModel;

import mongoose, { Schema, type Document, type Model } from "mongoose";

export interface ITrainerSocial {
  instagram?: string;
  facebook?: string;
  youtube?: string;
}

export interface ITrainer {
  name: string;
  role: string;
  specialty: string;
  experience: string;
  image: string;
  bio: string;
  certificates: string[];
  social: ITrainerSocial;
  isActive: boolean;
  sortOrder: number;
}

export interface ITrainerDocument extends ITrainer, Document {
  createdAt: Date;
  updatedAt: Date;
}

const trainerSchema = new Schema<ITrainerDocument>(
  {
    name: { type: String, required: true, trim: true },
    role: { type: String, required: true },
    specialty: { type: String, required: true },
    experience: { type: String, required: true },
    image: { type: String, required: true },
    bio: { type: String, required: true },
    certificates: [String],
    social: {
      instagram: String,
      facebook: String,
      youtube: String,
    },
    isActive: { type: Boolean, default: true },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Trainer: Model<ITrainerDocument> =
  mongoose.models.Trainer ||
  mongoose.model<ITrainerDocument>("Trainer", trainerSchema);

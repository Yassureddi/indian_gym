import mongoose, { Schema, type Document, type Model } from "mongoose";

export type ContactStatus = "new" | "read" | "replied" | "archived";

export interface IContact {
  name: string;
  phone: string;
  goal?: string;
  message: string;
  status: ContactStatus;
}

export interface IContactDocument extends IContact, Document {
  createdAt: Date;
  updatedAt: Date;
}

const contactSchema = new Schema<IContactDocument>(
  {
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    goal: String,
    message: { type: String, required: true, trim: true },
    status: {
      type: String,
      enum: ["new", "read", "replied", "archived"],
      default: "new",
    },
  },
  { timestamps: true }
);

contactSchema.index({ status: 1, createdAt: -1 });

export const Contact: Model<IContactDocument> =
  mongoose.models.Contact ||
  mongoose.model<IContactDocument>("Contact", contactSchema);

import mongoose, { Schema, type Model } from "mongoose";
import type { Notification } from "@/lib/admin/notification-types";
import { idField, schemaOptions } from "./schema";

const notificationSchema = new Schema<Notification>(
  {
    ...idField,
    type: {
      type: String,
      enum: ["membership", "payments", "store", "system"],
      required: true,
    },
    title: { type: String, required: true },
    message: { type: String, required: true },
    memberId: String,
    memberName: String,
    relatedRecordId: String,
    priority: { type: String, enum: ["high", "medium", "low"], required: true },
    read: { type: Boolean, required: true, index: true },
    createdAt: { type: String, required: true, index: true },
    dedupeKey: { type: String, sparse: true, unique: true },
  },
  schemaOptions
);

const NotificationModel: Model<Notification> =
  mongoose.models.Notification ||
  mongoose.model<Notification>("Notification", notificationSchema);

export default NotificationModel;

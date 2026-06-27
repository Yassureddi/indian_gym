import mongoose, { Schema, type Model } from "mongoose";
import type { ActivityItem } from "@/lib/admin/types";
import { idField, schemaOptions } from "./schema";

const activitySchema = new Schema<ActivityItem>(
  {
    ...idField,
    type: {
      type: String,
      enum: ["member_joined", "payment", "check_in", "membership", "plan_assigned"],
      required: true,
    },
    message: { type: String, required: true },
    userId: { type: String, index: true },
    createdAt: { type: String, required: true, index: true },
  },
  schemaOptions
);

const ActivityModel: Model<ActivityItem> =
  mongoose.models.Activity || mongoose.model<ActivityItem>("Activity", activitySchema);

export default ActivityModel;

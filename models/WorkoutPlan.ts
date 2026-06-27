import mongoose, { Schema, type Model } from "mongoose";
import type { WorkoutPlan } from "@/lib/auth/types";
import { idField, schemaOptions } from "./schema";

const workoutExerciseSchema = new Schema(
  {
    name: { type: String, required: true },
    sets: { type: String, required: true },
    reps: { type: String, required: true },
    notes: String,
  },
  { _id: false }
);

const workoutPlanSchema = new Schema<WorkoutPlan>(
  {
    ...idField,
    userId: { type: String, required: true, index: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    exercises: [workoutExerciseSchema],
    assignedBy: String,
    createdAt: { type: String, required: true },
    updatedAt: { type: String, required: true },
  },
  schemaOptions
);

workoutPlanSchema.index({ userId: 1, createdAt: -1 });

const WorkoutPlanModel: Model<WorkoutPlan> =
  mongoose.models.WorkoutPlan ||
  mongoose.model<WorkoutPlan>("WorkoutPlan", workoutPlanSchema);

export default WorkoutPlanModel;

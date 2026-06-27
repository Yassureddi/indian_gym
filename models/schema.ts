import { Schema } from "mongoose";

/** Standard string id field used across all collections. */
export const idField = {
  id: { type: String, required: true, unique: true, index: true },
};

export const schemaOptions = {
  versionKey: false as const,
};

export function getOrCreateModel<T>(
  name: string,
  schema: Schema<T>
) {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const mongoose = require("mongoose") as typeof import("mongoose");
  return (mongoose.models[name] as import("mongoose").Model<T>) ||
    mongoose.model<T>(name, schema);
}

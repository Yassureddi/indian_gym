import mongoose, { Schema, type Document, type Model, Types } from "mongoose";

export interface IAttendance {
  userId: Types.ObjectId;
  date: string;
  checkIn: string;
  checkOut?: string;
}

export interface IAttendanceDocument extends IAttendance, Document {
  createdAt: Date;
  updatedAt: Date;
}

const attendanceSchema = new Schema<IAttendanceDocument>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    date: { type: String, required: true },
    checkIn: { type: String, required: true },
    checkOut: String,
  },
  { timestamps: true }
);

attendanceSchema.index({ userId: 1, date: 1 }, { unique: true });

export const Attendance: Model<IAttendanceDocument> =
  mongoose.models.Attendance ||
  mongoose.model<IAttendanceDocument>("Attendance", attendanceSchema);

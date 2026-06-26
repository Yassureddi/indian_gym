import mongoose, { Schema } from "mongoose";
const attendanceSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    date: { type: String, required: true },
    checkIn: { type: String, required: true },
    checkOut: String,
}, { timestamps: true });
attendanceSchema.index({ userId: 1, date: 1 }, { unique: true });
export const Attendance = mongoose.models.Attendance ||
    mongoose.model("Attendance", attendanceSchema);

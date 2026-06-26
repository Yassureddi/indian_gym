import { type Document, type Model, Types } from "mongoose";
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
export declare const Attendance: Model<IAttendanceDocument>;

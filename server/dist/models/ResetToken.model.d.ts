import { type Document, type Model, Types } from "mongoose";
export interface IResetToken {
    token: string;
    userId: Types.ObjectId;
    expiresAt: Date;
}
export interface IResetTokenDocument extends IResetToken, Document {
}
export declare const ResetToken: Model<IResetTokenDocument>;

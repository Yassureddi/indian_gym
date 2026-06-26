import { type Document, type Model } from "mongoose";
export interface IUser {
    email: string;
    phone: string;
    name: string;
    passwordHash: string;
    role: "admin" | "member";
    avatar?: string;
    goal?: string;
    isActive: boolean;
}
export interface IUserDocument extends IUser, Document {
    createdAt: Date;
    updatedAt: Date;
}
export declare const User: Model<IUserDocument>;

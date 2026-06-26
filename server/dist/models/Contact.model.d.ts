import { type Document, type Model } from "mongoose";
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
export declare const Contact: Model<IContactDocument>;

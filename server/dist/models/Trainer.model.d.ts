import { type Document, type Model } from "mongoose";
export interface ITrainerSocial {
    instagram?: string;
    facebook?: string;
    youtube?: string;
}
export interface ITrainer {
    name: string;
    role: string;
    specialty: string;
    experience: string;
    image: string;
    bio: string;
    certificates: string[];
    social: ITrainerSocial;
    isActive: boolean;
    sortOrder: number;
}
export interface ITrainerDocument extends ITrainer, Document {
    createdAt: Date;
    updatedAt: Date;
}
export declare const Trainer: Model<ITrainerDocument>;

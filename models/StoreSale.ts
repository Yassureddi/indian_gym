import mongoose, { Schema, type Model } from "mongoose";
import type { StoreSale, StoreSaleItem } from "@/lib/store-pos";
import { idField, schemaOptions } from "./schema";

const storeSaleItemSchema = new Schema<StoreSaleItem>(
  {
    supplementId: { type: String, required: true },
    productName: { type: String, required: true },
    brand: { type: String, required: true },
    image: { type: String, required: true },
    unitPrice: { type: Number, required: true },
    quantity: { type: Number, required: true },
    lineTotal: { type: Number, required: true },
  },
  { _id: false }
);

const storeSaleSchema = new Schema<StoreSale>(
  {
    ...idField,
    invoiceNumber: { type: String, required: true, unique: true },
    customerType: { type: String, enum: ["member", "walk_in"], required: true },
    memberId: { type: String, index: true },
    customerName: { type: String, required: true },
    mobile: { type: String, required: true },
    items: [storeSaleItemSchema],
    totalItems: { type: Number, required: true },
    grandTotal: { type: Number, required: true },
    paymentMethod: { type: String, enum: ["cash", "upi"], required: true },
    amountReceived: Number,
    changeGiven: Number,
    soldById: { type: String, required: true },
    soldByName: { type: String, required: true },
    createdAt: { type: String, required: true, index: true },
  },
  schemaOptions
);

const StoreSaleModel: Model<StoreSale> =
  mongoose.models.StoreSale ||
  mongoose.model<StoreSale>("StoreSale", storeSaleSchema);

export default StoreSaleModel;

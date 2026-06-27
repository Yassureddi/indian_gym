import mongoose, { Schema, type Model } from "mongoose";
import type { SupplementOrder } from "@/lib/supplements";
import { idField, schemaOptions } from "./schema";

const supplementOrderSchema = new Schema<SupplementOrder>(
  {
    ...idField,
    supplementId: { type: String, required: true, index: true },
    productName: { type: String, required: true },
    productImage: { type: String, required: true },
    customerName: { type: String, required: true },
    mobile: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
    quantity: { type: Number, required: true },
    unitPrice: { type: Number, required: true },
    totalAmount: { type: Number, required: true },
    paymentMethod: { type: String, enum: ["cash", "upi"], required: true },
    paymentReference: String,
    status: {
      type: String,
      enum: ["pending", "confirmed", "ready_for_pickup", "delivered", "cancelled"],
      required: true,
      index: true,
    },
    createdAt: { type: String, required: true },
    updatedAt: { type: String, required: true },
  },
  schemaOptions
);

const SupplementOrderModel: Model<SupplementOrder> =
  mongoose.models.SupplementOrder ||
  mongoose.model<SupplementOrder>("SupplementOrder", supplementOrderSchema);

export default SupplementOrderModel;

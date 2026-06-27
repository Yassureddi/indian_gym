import SupplementOrderModel from "@/models/SupplementOrder";
import { ensureDb, toPlain, toPlainList } from "./mongo-helpers";
import { createId } from "./store";
import type {
  SupplementOrder,
  SupplementOrderStatus,
  SupplementPaymentMethod,
} from "@/lib/supplements";
import { getEffectivePrice } from "@/lib/supplements";
import { getSupplementById, reduceSupplementStock, updateSupplement } from "./supplements";

export async function getSupplementOrders(): Promise<SupplementOrder[]> {
  await ensureDb();
  const docs = await SupplementOrderModel.find().sort({ createdAt: -1 }).lean();
  return toPlainList<SupplementOrder>(docs);
}

export async function getSupplementOrderById(id: string): Promise<SupplementOrder | null> {
  await ensureDb();
  const doc = await SupplementOrderModel.findOne({ id }).lean();
  return toPlain<SupplementOrder>(doc);
}

export async function createSupplementOrder(data: {
  supplementId: string;
  customerName: string;
  mobile: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  quantity: number;
  paymentMethod: SupplementPaymentMethod;
  paymentReference?: string;
}): Promise<{ ok: true; order: SupplementOrder } | { ok: false; error: string }> {
  const supplement = await getSupplementById(data.supplementId);
  if (!supplement || !supplement.isActive) {
    return { ok: false, error: "Product not available" };
  }
  if (supplement.stockQuantity < data.quantity) {
    return { ok: false, error: "Insufficient stock for this quantity" };
  }

  const unitPrice = getEffectivePrice(supplement);
  const totalAmount = unitPrice * data.quantity;
  const now = new Date().toISOString();

  const order: SupplementOrder = {
    id: createId("order"),
    supplementId: supplement.id,
    productName: supplement.name,
    productImage: supplement.image,
    customerName: data.customerName.trim(),
    mobile: data.mobile.trim(),
    address: data.address.trim(),
    city: data.city.trim(),
    state: data.state.trim(),
    pincode: data.pincode.trim(),
    quantity: data.quantity,
    unitPrice,
    totalAmount,
    paymentMethod: data.paymentMethod,
    paymentReference: data.paymentReference?.trim(),
    status: "pending",
    createdAt: now,
    updatedAt: now,
  };

  const reduced = await reduceSupplementStock(supplement.id, data.quantity);
  if (!reduced) {
    return { ok: false, error: "Could not update stock. Please try again." };
  }

  await ensureDb();
  await SupplementOrderModel.create(order);

  return { ok: true, order };
}

export async function updateSupplementOrderStatus(
  id: string,
  status: SupplementOrderStatus
): Promise<SupplementOrder | null> {
  await ensureDb();
  const current = await getSupplementOrderById(id);
  if (!current) return null;

  if (current.status === "cancelled" && status !== "cancelled") {
    return null;
  }

  if (status === "cancelled" && current.status !== "cancelled") {
    await restoreStock(current.supplementId, current.quantity);
  }

  const doc = await SupplementOrderModel.findOneAndUpdate(
    { id },
    { status, updatedAt: new Date().toISOString() },
    { new: true }
  ).lean();
  return toPlain<SupplementOrder>(doc);
}

async function restoreStock(supplementId: string, quantity: number) {
  const supplement = await getSupplementById(supplementId);
  if (!supplement) return;
  await updateSupplement(supplementId, {
    stockQuantity: supplement.stockQuantity + quantity,
  });
}

export async function ensureSeedSupplementOrders() {
  await ensureDb();
  await SupplementOrderModel.countDocuments();
}

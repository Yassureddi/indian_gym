import { readJson, writeJson, createId } from "./store";
import type {
  SupplementOrder,
  SupplementOrderStatus,
  SupplementPaymentMethod,
} from "@/lib/supplements";
import { getEffectivePrice } from "@/lib/supplements";
import { getSupplementById, reduceSupplementStock } from "./supplements";

const FILE = "supplement-orders.json";

export async function getSupplementOrders(): Promise<SupplementOrder[]> {
  const items = await readJson<SupplementOrder[]>(FILE, []);
  return items.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export async function getSupplementOrderById(id: string): Promise<SupplementOrder | null> {
  return (await getSupplementOrders()).find((o) => o.id === id) ?? null;
}

async function saveOrders(items: SupplementOrder[]) {
  await writeJson(FILE, items);
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

  const items = await getSupplementOrders();
  items.push(order);
  await saveOrders(items);

  return { ok: true, order };
}

export async function updateSupplementOrderStatus(
  id: string,
  status: SupplementOrderStatus
): Promise<SupplementOrder | null> {
  const items = await getSupplementOrders();
  const index = items.findIndex((o) => o.id === id);
  if (index === -1) return null;

  const current = items[index];
  if (current.status === "cancelled" && status !== "cancelled") {
    return null;
  }

  if (status === "cancelled" && current.status !== "cancelled") {
    await restoreStock(current.supplementId, current.quantity);
  }

  items[index] = {
    ...current,
    status,
    updatedAt: new Date().toISOString(),
  };
  await saveOrders(items);
  return items[index];
}

async function restoreStock(supplementId: string, quantity: number) {
  const { updateSupplement, getSupplementById: getById } = await import("./supplements");
  const supplement = await getById(supplementId);
  if (!supplement) return;
  await updateSupplement(supplementId, {
    stockQuantity: supplement.stockQuantity + quantity,
  });
}

export async function ensureSeedSupplementOrders() {
  await getSupplementOrders();
}

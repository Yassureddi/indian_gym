import { readJson, writeJson, createId } from "./store";
import type { StoreSale, StoreSaleItem } from "@/lib/store-pos";
import { getEffectivePrice } from "@/lib/supplements";
import { getSupplementById, getSupplements } from "./supplements";
import {
  notifyStoreSaleCompleted,
  notifyStockLevelChange,
} from "@/lib/notifications/events";

const FILE = "store-sales.json";

export async function getStoreSales(): Promise<StoreSale[]> {
  const items = await readJson<StoreSale[]>(FILE, []);
  return items.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

async function saveStoreSales(items: StoreSale[]) {
  await writeJson(FILE, items);
}

function generateInvoiceNumber(existing: StoreSale[]): string {
  const today = new Date();
  const prefix = `INV-${today.getFullYear()}${String(today.getMonth() + 1).padStart(2, "0")}${String(today.getDate()).padStart(2, "0")}`;
  const todayCount = existing.filter((s) => s.invoiceNumber.startsWith(prefix)).length;
  return `${prefix}-${String(todayCount + 1).padStart(4, "0")}`;
}

async function reduceStockBatch(
  lines: { supplementId: string; quantity: number }[]
): Promise<
  | { ok: true; previousQuantities: Record<string, number> }
  | { ok: false; error: string }
> {
  const supplements = await getSupplements();
  const previousQuantities: Record<string, number> = {};

  for (const line of lines) {
    const supplement = supplements.find((s) => s.id === line.supplementId);
    if (!supplement || !supplement.isActive) {
      return { ok: false, error: "One or more products are unavailable" };
    }
    if (supplement.stockQuantity < line.quantity) {
      return { ok: false, error: `Insufficient stock for ${supplement.name}` };
    }
    previousQuantities[line.supplementId] = supplement.stockQuantity;
  }

  for (const line of lines) {
    const index = supplements.findIndex((s) => s.id === line.supplementId);
    supplements[index] = {
      ...supplements[index],
      stockQuantity: supplements[index].stockQuantity - line.quantity,
      updatedAt: new Date().toISOString(),
    };
  }

  await writeJson("supplements.json", supplements);
  return { ok: true, previousQuantities };
}

export async function createStoreSale(data: {
  items: { supplementId: string; quantity: number }[];
  customerType: StoreSale["customerType"];
  memberId?: string;
  customerName: string;
  mobile: string;
  paymentMethod: StoreSale["paymentMethod"];
  amountReceived?: number;
  soldById: string;
  soldByName: string;
}): Promise<{ ok: true; sale: StoreSale } | { ok: false; error: string }> {
  if (data.items.length === 0) {
    return { ok: false, error: "Cart is empty" };
  }

  const saleItems: StoreSaleItem[] = [];
  let grandTotal = 0;
  let totalItems = 0;

  for (const line of data.items) {
    const supplement = await getSupplementById(line.supplementId);
    if (!supplement || !supplement.isActive) {
      return { ok: false, error: `Product unavailable: ${line.supplementId}` };
    }
    if (supplement.stockQuantity < line.quantity) {
      return { ok: false, error: `Insufficient stock for ${supplement.name}` };
    }

    const unitPrice = getEffectivePrice(supplement);
    const lineTotal = unitPrice * line.quantity;
    grandTotal += lineTotal;
    totalItems += line.quantity;

    saleItems.push({
      supplementId: supplement.id,
      productName: supplement.name,
      brand: supplement.brand,
      image: supplement.image,
      unitPrice,
      quantity: line.quantity,
      lineTotal,
    });
  }

  if (data.paymentMethod === "cash") {
    if (data.amountReceived == null || data.amountReceived < grandTotal) {
      return { ok: false, error: "Amount received must cover the total" };
    }
  }

  const stockResult = await reduceStockBatch(
    data.items.map((i) => ({ supplementId: i.supplementId, quantity: i.quantity }))
  );
  if (!stockResult.ok) return stockResult;

  for (const line of data.items) {
    const before = stockResult.previousQuantities[line.supplementId];
    const supplement = await getSupplementById(line.supplementId);
    if (supplement && before != null) {
      await notifyStockLevelChange(
        supplement.id,
        supplement.name,
        before,
        supplement.stockQuantity
      );
    }
  }

  const existing = await getStoreSales();
  const now = new Date().toISOString();
  const changeGiven =
    data.paymentMethod === "cash" && data.amountReceived != null
      ? data.amountReceived - grandTotal
      : undefined;

  const sale: StoreSale = {
    id: createId("pos"),
    invoiceNumber: generateInvoiceNumber(existing),
    customerType: data.customerType,
    memberId: data.memberId,
    customerName: data.customerName.trim(),
    mobile: data.mobile.trim(),
    items: saleItems,
    totalItems,
    grandTotal,
    paymentMethod: data.paymentMethod,
    amountReceived: data.amountReceived,
    changeGiven,
    soldById: data.soldById,
    soldByName: data.soldByName,
    createdAt: now,
  };

  existing.unshift(sale);
  await saveStoreSales(existing);

  await notifyStoreSaleCompleted(sale.id, sale.customerName, sale.grandTotal);

  return { ok: true, sale };
}

export async function getStoreSaleById(id: string): Promise<StoreSale | null> {
  return (await getStoreSales()).find((s) => s.id === id) ?? null;
}

export async function ensureSeedStoreSales() {
  await getStoreSales();
}

export function getStoreSalesStats(sales: StoreSale[]) {
  const now = new Date();
  const todaySales = sales.filter((s) => {
    const d = new Date(s.createdAt);
    return (
      d.getDate() === now.getDate() &&
      d.getMonth() === now.getMonth() &&
      d.getFullYear() === now.getFullYear()
    );
  });

  const monthSales = sales.filter((s) => {
    const d = new Date(s.createdAt);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });

  const productCounts: Record<string, { name: string; qty: number; revenue: number }> = {};
  for (const sale of sales) {
    for (const item of sale.items) {
      if (!productCounts[item.supplementId]) {
        productCounts[item.supplementId] = {
          name: item.productName,
          qty: 0,
          revenue: 0,
        };
      }
      productCounts[item.supplementId].qty += item.quantity;
      productCounts[item.supplementId].revenue += item.lineTotal;
    }
  }

  const bestSelling = Object.entries(productCounts)
    .map(([id, data]) => ({ id, ...data }))
    .sort((a, b) => b.qty - a.qty)
    .slice(0, 5);

  return {
    todaySalesCount: todaySales.length,
    todayRevenue: todaySales.reduce((sum, s) => sum + s.grandTotal, 0),
    monthlyRevenue: monthSales.reduce((sum, s) => sum + s.grandTotal, 0),
    bestSelling,
    recentSales: sales.slice(0, 8),
  };
}

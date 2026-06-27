import { createNotification } from "@/lib/db/notifications";
import { LOW_STOCK_THRESHOLD } from "@/lib/supplements";

export async function notifyMemberJoined(memberId: string, memberName: string) {
  await createNotification({
    type: "membership",
    title: "New Member Joined",
    message: `New member "${memberName}" has joined the gym.`,
    memberId,
    memberName,
    relatedRecordId: memberId,
    priority: "low",
  });
}

export async function notifyMembershipRenewed(
  memberId: string,
  memberName: string,
  membershipId: string
) {
  const firstName = memberName.split(" ")[0];
  await createNotification({
    type: "membership",
    title: "Membership Renewed",
    message: `${firstName} renewed his membership successfully.`,
    memberId,
    memberName,
    relatedRecordId: membershipId,
    priority: "low",
  });
}

export async function notifyPaymentCompleted(
  memberId: string,
  memberName: string,
  paymentId: string,
  amount: number,
  method: "cash" | "upi" | "card",
  planName?: string
) {
  const firstName = memberName.split(" ")[0];
  const methodLabel = method.toUpperCase();

  let message: string;
  if (method === "upi") {
    message = "UPI payment completed successfully.";
  } else if (method === "cash") {
    message = `Cash payment received from ${firstName}.`;
  } else if (planName?.toLowerCase().includes("monthly")) {
    message = `Monthly payment received from ${firstName}.`;
  } else {
    message = `Payment of ₹${amount.toLocaleString("en-IN")} received from ${firstName}.`;
  }

  await createNotification({
    type: "payments",
    title: "Payment Received",
    message,
    memberId,
    memberName,
    relatedRecordId: paymentId,
    priority: "medium",
  });
}

export async function notifyStoreSaleCompleted(
  saleId: string,
  customerName: string,
  grandTotal: number
) {
  await createNotification({
    type: "store",
    title: "Supplement Sale",
    message: `Supplement sale completed successfully${customerName ? ` for ${customerName}` : ""} (₹${grandTotal.toLocaleString("en-IN")}).`,
    relatedRecordId: saleId,
    memberName: customerName || undefined,
    priority: "medium",
  });
}

export async function notifyStockLevelChange(
  supplementId: string,
  productName: string,
  previousQty: number,
  newQty: number
) {
  if (newQty <= 0 && previousQty > 0) {
    await createNotification({
      type: "store",
      title: "Out of Stock",
      message: `${productName} is out of stock.`,
      relatedRecordId: supplementId,
      priority: "high",
      dedupeKey: `stock-out-${supplementId}`,
    });
    return;
  }

  if (
    newQty > 0 &&
    newQty <= LOW_STOCK_THRESHOLD &&
    previousQty > LOW_STOCK_THRESHOLD
  ) {
    await createNotification({
      type: "store",
      title: "Low Stock Alert",
      message: `${productName} stock is running low.`,
      relatedRecordId: supplementId,
      priority: "medium",
      dedupeKey: `stock-low-${supplementId}`,
    });
  }
}

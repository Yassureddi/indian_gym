import { readJson, writeJson, createId } from "@/lib/db/store";
import type { Payment } from "@/lib/admin/types";

const FILE = "payments.json";

export async function getPayments(): Promise<Payment[]> {
  return readJson<Payment[]>(FILE, []);
}

export async function savePayment(payment: Payment) {
  const payments = await getPayments();
  payments.unshift(payment);
  await writeJson(FILE, payments);
}

export async function ensureSeedPayments() {
  const payments = await getPayments();
  if (payments.length > 0) return;

  const now = new Date();
  const seed: Payment[] = [
    {
      id: createId("pay"),
      userId: "user_member_demo",
      memberName: "Demo Member",
      amount: 14999,
      method: "upi",
      status: "completed",
      planName: "Half Yearly",
      date: new Date(now.getTime() - 2 * 86400000).toISOString().split("T")[0],
      reference: "UPI-482910",
    },
    {
      id: createId("pay"),
      userId: "user_member_demo",
      memberName: "Demo Member",
      amount: 2999,
      method: "cash",
      status: "completed",
      planName: "Monthly",
      date: new Date(now.getTime() - 35 * 86400000).toISOString().split("T")[0],
    },
    {
      id: createId("pay"),
      userId: "user_member_demo",
      memberName: "Demo Member",
      amount: 7999,
      method: "upi",
      status: "pending",
      planName: "Quarterly",
      date: now.toISOString().split("T")[0],
      reference: "UPI-PENDING",
    },
  ];

  await writeJson(FILE, seed);
}

export function getMonthlyRevenue(payments: Payment[]) {
  const months: Record<string, number> = {};
  const labels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  for (let i = 5; i >= 0; i--) {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    months[key] = 0;
  }

  payments
    .filter((p) => p.status === "completed")
    .forEach((p) => {
      const key = p.date.slice(0, 7);
      if (key in months) months[key] += p.amount;
    });

  return Object.entries(months).map(([key, revenue]) => {
    const month = parseInt(key.split("-")[1], 10) - 1;
    return { month: labels[month], revenue };
  });
}

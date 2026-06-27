import PaymentModel from "@/models/Payment";
import { ensureDb, toPlain, toPlainList } from "./mongo-helpers";
import { createId } from "./store";
import type { Payment } from "@/lib/admin/types";

export async function getPayments(): Promise<Payment[]> {
  await ensureDb();
  const docs = await PaymentModel.find().lean();
  return toPlainList<Payment>(docs);
}

export async function getPaymentById(id: string): Promise<Payment | null> {
  await ensureDb();
  const doc = await PaymentModel.findOne({ id }).lean();
  return toPlain<Payment>(doc);
}

export async function getPaymentsByUserId(userId: string): Promise<Payment[]> {
  await ensureDb();
  const docs = await PaymentModel.find({ userId }).lean();
  return toPlainList<Payment>(docs).sort((a, b) =>
    (b.dueDate ?? b.date).localeCompare(a.dueDate ?? a.date)
  );
}

export async function createPayment(data: Omit<Payment, "id">): Promise<Payment> {
  const payment: Payment = { ...data, id: createId("pay") };
  await savePayment(payment);
  return payment;
}

export async function savePayment(payment: Payment) {
  await ensureDb();
  await PaymentModel.findOneAndUpdate({ id: payment.id }, payment, {
    upsert: true,
    new: true,
  });
}

export async function ensureSeedPayments() {
  await ensureDb();
  const count = await PaymentModel.countDocuments();
  if (count > 0) return;

  const now = new Date();
  const seed: Payment[] = [
    {
      id: "pay_demo_1",
      userId: "user_member_demo",
      membershipId: "mem_demo_half_yearly",
      memberName: "Demo Member",
      amount: 8500,
      method: "upi",
      status: "completed",
      planId: "half-yearly:cardio-strength",
      planName: "Half Yearly · Cardio + Strength Training",
      membershipDuration: "6 Months",
      date: new Date(now.getTime() - 2 * 86400000).toISOString().split("T")[0],
      reference: "UPI-482910",
    },
    {
      id: "pay_demo_2",
      userId: "user_member_demo",
      membershipId: "mem_demo_half_yearly",
      memberName: "Demo Member",
      amount: 1500,
      method: "cash",
      status: "completed",
      planId: "monthly:strength",
      planName: "Monthly · Strength Training",
      membershipDuration: "1 Month",
      date: new Date(now.getTime() - 35 * 86400000).toISOString().split("T")[0],
    },
    {
      id: "pay_demo_3",
      userId: "user_member_demo",
      membershipId: "mem_demo_half_yearly",
      memberName: "Demo Member",
      amount: 4500,
      method: "upi",
      status: "pending",
      planId: "quarterly:cardio-strength",
      planName: "Quarterly · Cardio + Strength Training",
      membershipDuration: "3 Months",
      date: now.toISOString().split("T")[0],
      reference: "UPI-PENDING",
    },
  ];

  await PaymentModel.insertMany(seed, { ordered: false }).catch((error: unknown) => {
    const code = (error as { code?: number }).code;
    if (code !== 11000) throw error;
  });
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

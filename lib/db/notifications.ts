import { readJson, writeJson, createId } from "@/lib/db/store";
import type { Notification } from "@/lib/admin/types";

const FILE = "notifications.json";

export async function getNotifications(): Promise<Notification[]> {
  const items = await readJson<Notification[]>(FILE, []);
  return items.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function saveNotification(notification: Notification) {
  const items = await getNotifications();
  items.unshift(notification);
  await writeJson(FILE, items);
}

export async function markNotificationRead(id: string) {
  const items = await readJson<Notification[]>(FILE, []);
  const index = items.findIndex((n) => n.id === id);
  if (index >= 0) {
    items[index].read = true;
    await writeJson(FILE, items);
  }
}

export async function ensureSeedNotifications() {
  const items = await getNotifications();
  if (items.length > 0) return;

  const now = Date.now();
  const seed: Notification[] = [
    {
      id: createId("notif"),
      title: "New Member Registration",
      message: "Demo Member completed registration and activated Half Yearly plan.",
      type: "success",
      read: false,
      createdAt: new Date(now - 3600000).toISOString(),
    },
    {
      id: createId("notif"),
      title: "Payment Pending",
      message: "Quarterly membership payment of ₹7,999 is awaiting confirmation.",
      type: "warning",
      read: false,
      createdAt: new Date(now - 7200000).toISOString(),
    },
    {
      id: createId("notif"),
      title: "Peak Hours Alert",
      message: "Gym attendance is 85% capacity between 6–8 AM today.",
      type: "info",
      read: true,
      createdAt: new Date(now - 86400000).toISOString(),
    },
    {
      id: createId("notif"),
      title: "Membership Expiring",
      message: "3 members have memberships expiring within the next 7 days.",
      type: "alert",
      read: false,
      createdAt: new Date(now - 172800000).toISOString(),
    },
  ];

  await writeJson(FILE, seed);
}

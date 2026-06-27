import { readJson, writeJson, createId } from "@/lib/db/store";
import type {
  Notification,
  NotificationCategory,
  NotificationPriority,
} from "@/lib/admin/notification-types";
import { getMembers } from "./users";
import { getMembershipByUserId } from "./memberships";
import { getRemainingDays } from "@/lib/membership-utils";

const FILE = "notifications.json";
const MAX_NOTIFICATIONS = 500;

function normalizeNotification(raw: Partial<Notification> & { id: string }): Notification {
  return {
    id: raw.id,
    type: raw.type ?? "system",
    title: raw.title ?? "Notification",
    message: raw.message ?? "",
    memberId: raw.memberId,
    memberName: raw.memberName,
    relatedRecordId: raw.relatedRecordId,
    priority: raw.priority ?? "medium",
    read: Boolean(raw.read),
    createdAt: raw.createdAt ?? new Date().toISOString(),
    dedupeKey: raw.dedupeKey,
  };
}

export async function getNotifications(): Promise<Notification[]> {
  const items = await readJson<Notification[]>(FILE, []);
  return items
    .map((n) => normalizeNotification(n))
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function getUnreadNotificationCount(): Promise<number> {
  const items = await getNotifications();
  return items.filter((n) => !n.read).length;
}

export async function getNotificationById(id: string): Promise<Notification | null> {
  return (await getNotifications()).find((n) => n.id === id) ?? null;
}

export interface CreateNotificationInput {
  type: NotificationCategory;
  title: string;
  message: string;
  memberId?: string;
  memberName?: string;
  relatedRecordId?: string;
  priority?: NotificationPriority;
  dedupeKey?: string;
}

export async function createNotification(
  input: CreateNotificationInput
): Promise<Notification | null> {
  const items = await getNotifications();

  if (input.dedupeKey && items.some((n) => n.dedupeKey === input.dedupeKey)) {
    return null;
  }

  const notification: Notification = {
    id: createId("ntf"),
    type: input.type,
    title: input.title,
    message: input.message,
    memberId: input.memberId,
    memberName: input.memberName,
    relatedRecordId: input.relatedRecordId,
    priority: input.priority ?? "medium",
    read: false,
    createdAt: new Date().toISOString(),
    dedupeKey: input.dedupeKey,
  };

  items.unshift(notification);
  await writeJson(FILE, items.slice(0, MAX_NOTIFICATIONS));
  return notification;
}

export async function markNotificationRead(id: string): Promise<Notification | null> {
  const items = await getNotifications();
  const index = items.findIndex((n) => n.id === id);
  if (index < 0) return null;
  items[index] = { ...items[index], read: true };
  await writeJson(FILE, items);
  return items[index];
}

export async function markNotificationUnread(id: string): Promise<Notification | null> {
  const items = await getNotifications();
  const index = items.findIndex((n) => n.id === id);
  if (index < 0) return null;
  items[index] = { ...items[index], read: false };
  await writeJson(FILE, items);
  return items[index];
}

export async function deleteNotification(id: string): Promise<boolean> {
  const items = await getNotifications();
  const next = items.filter((n) => n.id !== id);
  if (next.length === items.length) return false;
  await writeJson(FILE, next);
  return true;
}

export async function markAllNotificationsRead(): Promise<number> {
  const items = await getNotifications();
  let count = 0;
  const updated = items.map((n) => {
    if (n.read) return n;
    count++;
    return { ...n, read: true };
  });
  await writeJson(FILE, updated);
  return count;
}

export async function clearAllNotifications(): Promise<number> {
  const items = await getNotifications();
  const count = items.length;
  await writeJson(FILE, []);
  return count;
}

export async function syncMembershipExpiryNotifications(): Promise<void> {
  const members = await getMembers();

  for (const member of members) {
    const membership = await getMembershipByUserId(member.id);
    if (!membership || membership.status !== "active") continue;

    const remaining = getRemainingDays(membership.endDate);
    const firstName = member.name.split(" ")[0];

    if (remaining === 7) {
      await createNotification({
        type: "membership",
        title: "Membership Expiring Soon",
        message: `${firstName}'s membership expires in 7 days.`,
        memberId: member.id,
        memberName: member.name,
        relatedRecordId: membership.id,
        priority: "medium",
        dedupeKey: `expiry-7-${member.id}-${membership.endDate}`,
      });
    } else if (remaining === 3) {
      await createNotification({
        type: "membership",
        title: "Membership Expiring Soon",
        message: `${firstName}'s membership expires in 3 days.`,
        memberId: member.id,
        memberName: member.name,
        relatedRecordId: membership.id,
        priority: "medium",
        dedupeKey: `expiry-3-${member.id}-${membership.endDate}`,
      });
    } else if (remaining === 0) {
      await createNotification({
        type: "membership",
        title: "Membership Expires Today",
        message: `${firstName}'s membership expires today.`,
        memberId: member.id,
        memberName: member.name,
        relatedRecordId: membership.id,
        priority: "high",
        dedupeKey: `expiry-0-${member.id}-${membership.endDate}`,
      });
    }
  }
}

export async function ensureSeedNotifications() {
  const items = await getNotifications();
  if (items.length > 0) return;

  const now = Date.now();
  const seed: Notification[] = [
    {
      id: createId("ntf"),
      type: "membership",
      title: "Membership Expiring Soon",
      message: "Rahul's membership expires in 7 days.",
      memberName: "Rahul Kumar",
      priority: "medium",
      read: false,
      createdAt: new Date(now - 3600000).toISOString(),
    },
    {
      id: createId("ntf"),
      type: "payments",
      title: "Payment Received",
      message: "Monthly payment received from Rahul.",
      memberName: "Rahul Kumar",
      priority: "medium",
      read: false,
      createdAt: new Date(now - 7200000).toISOString(),
    },
    {
      id: createId("ntf"),
      type: "store",
      title: "Supplement Sale",
      message: "Supplement sale completed successfully.",
      priority: "low",
      read: true,
      createdAt: new Date(now - 86400000).toISOString(),
    },
  ];

  await writeJson(FILE, seed);
}

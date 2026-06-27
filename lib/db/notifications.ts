import NotificationModel from "@/models/Notification";
import { ensureDb, toPlain, toPlainList } from "./mongo-helpers";
import { createId } from "./store";
import type {
  Notification,
  NotificationCategory,
  NotificationPriority,
} from "@/lib/admin/notification-types";
import { getMembers } from "./users";
import { getMembershipByUserId } from "./memberships";
import { getRemainingDays } from "@/lib/membership-utils";

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
  await ensureDb();
  const docs = await NotificationModel.find()
    .sort({ createdAt: -1 })
    .limit(MAX_NOTIFICATIONS)
    .lean();
  return toPlainList<Notification>(docs).map((n) => normalizeNotification(n));
}

export async function getUnreadNotificationCount(): Promise<number> {
  await ensureDb();
  return NotificationModel.countDocuments({ read: false });
}

export async function getNotificationById(id: string): Promise<Notification | null> {
  await ensureDb();
  const doc = await NotificationModel.findOne({ id }).lean();
  const n = toPlain<Notification>(doc);
  return n ? normalizeNotification(n) : null;
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
  await ensureDb();

  if (input.dedupeKey) {
    const existing = await NotificationModel.findOne({ dedupeKey: input.dedupeKey }).lean();
    if (existing) return null;
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

  await NotificationModel.create(notification);

  const count = await NotificationModel.countDocuments();
  if (count > MAX_NOTIFICATIONS) {
    const oldest = await NotificationModel.find()
      .sort({ createdAt: 1 })
      .limit(count - MAX_NOTIFICATIONS)
      .select("id")
      .lean();
    const ids = oldest.map((d) => d.id);
    await NotificationModel.deleteMany({ id: { $in: ids } });
  }

  return notification;
}

export async function markNotificationRead(id: string): Promise<Notification | null> {
  await ensureDb();
  const doc = await NotificationModel.findOneAndUpdate(
    { id },
    { read: true },
    { new: true }
  ).lean();
  const n = toPlain<Notification>(doc);
  return n ? normalizeNotification(n) : null;
}

export async function markNotificationUnread(id: string): Promise<Notification | null> {
  await ensureDb();
  const doc = await NotificationModel.findOneAndUpdate(
    { id },
    { read: false },
    { new: true }
  ).lean();
  const n = toPlain<Notification>(doc);
  return n ? normalizeNotification(n) : null;
}

export async function deleteNotification(id: string): Promise<boolean> {
  await ensureDb();
  const result = await NotificationModel.deleteOne({ id });
  return result.deletedCount > 0;
}

export async function markAllNotificationsRead(): Promise<number> {
  await ensureDb();
  const result = await NotificationModel.updateMany(
    { read: false },
    { $set: { read: true } }
  );
  return result.modifiedCount;
}

export async function clearAllNotifications(): Promise<number> {
  await ensureDb();
  const count = await NotificationModel.countDocuments();
  await NotificationModel.deleteMany({});
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
  await ensureDb();
  const count = await NotificationModel.countDocuments();
  if (count > 0) return;

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

  await NotificationModel.insertMany(seed);
}

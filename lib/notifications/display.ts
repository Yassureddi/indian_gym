import type { Notification, NotificationCategory } from "@/lib/admin/notification-types";

export function getNotificationIcon(
  type: NotificationCategory,
  message: string
): string {
  if (type === "payments") return "💰";
  if (type === "store") {
    if (message.toLowerCase().includes("out of stock")) return "📦";
    if (message.toLowerCase().includes("low")) return "📦";
    return "🛒";
  }
  if (type === "membership") return "🔔";
  return "⚙️";
}

export function formatNotificationDateTime(iso: string) {
  const date = new Date(iso);
  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function priorityLabel(priority?: Notification["priority"]) {
  const value = priority ?? "medium";
  return value.charAt(0).toUpperCase() + value.slice(1);
}

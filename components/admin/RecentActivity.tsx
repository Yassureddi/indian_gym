import type { ActivityItem } from "@/lib/admin/types";
import styles from "./RecentActivity.module.css";

const TYPE_ICONS: Record<ActivityItem["type"], string> = {
  member_joined: "👤",
  payment: "💳",
  check_in: "✓",
  membership: "★",
  plan_assigned: "📋",
};

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

interface RecentActivityProps {
  items: ActivityItem[];
}

export default function RecentActivity({ items }: RecentActivityProps) {
  return (
    <div className={styles.card}>
      <h3 className={styles.title}>Recent Activity</h3>
      <ul className={styles.list}>
        {items.length === 0 ? (
          <li className={styles.empty}>No recent activity</li>
        ) : (
          items.map((item) => (
            <li key={item.id} className={styles.item}>
              <span className={styles.icon}>{TYPE_ICONS[item.type]}</span>
              <div className={styles.content}>
                <p>{item.message}</p>
                <time>{timeAgo(item.createdAt)}</time>
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}

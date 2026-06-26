import styles from "./AdminStatCard.module.css";

interface AdminStatCardProps {
  label: string;
  value: string | number;
  change?: string;
  trend?: "up" | "down" | "neutral";
  icon?: React.ReactNode;
}

export default function AdminStatCard({
  label,
  value,
  change,
  trend = "neutral",
  icon,
}: AdminStatCardProps) {
  return (
    <div className={styles.card}>
      <div className={styles.top}>
        <span className={styles.label}>{label}</span>
        {icon && <span className={styles.icon}>{icon}</span>}
      </div>
      <p className={styles.value}>{value}</p>
      {change && (
        <span className={`${styles.change} ${styles[trend]}`}>{change}</span>
      )}
    </div>
  );
}

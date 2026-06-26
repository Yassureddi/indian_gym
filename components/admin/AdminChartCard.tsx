import styles from "./AdminChartCard.module.css";

interface AdminChartCardProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
}

export default function AdminChartCard({
  title,
  subtitle,
  children,
  className,
}: AdminChartCardProps) {
  return (
    <div className={`${styles.card} ${className ?? ""}`}>
      <div className={styles.header}>
        <h3 className={styles.title}>{title}</h3>
        {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
      </div>
      <div className={styles.body}>{children}</div>
    </div>
  );
}

import GlassCard from "@/components/ui/GlassCard";
import styles from "./StatCard.module.css";

interface StatCardProps {
  label: string;
  value: string | number;
  hint?: string;
}

export default function StatCard({ label, value, hint }: StatCardProps) {
  return (
    <GlassCard hover={false} padding="md" className={styles.card}>
      <p className={styles.label}>{label}</p>
      <p className={styles.value}>{value}</p>
      {hint && <p className={styles.hint}>{hint}</p>}
    </GlassCard>
  );
}

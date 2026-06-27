import styles from "./AdminFilterBar.module.css";

export function AdminFilterBar({ children }: { children: React.ReactNode }) {
  return <div className={styles.bar}>{children}</div>;
}

export function AdminSearchInput({
  value,
  onChange,
  placeholder,
  className,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}) {
  return (
    <input
      type="search"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={`${styles.search} ${className ?? ""}`}
    />
  );
}

export function AdminSelect({
  value,
  onChange,
  children,
  className,
  compact,
}: {
  value: string;
  onChange: (value: string) => void;
  children: React.ReactNode;
  className?: string;
  compact?: boolean;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`admin-select ${styles.select} ${compact ? styles.selectCompact : ""} ${className ?? ""}`}
    >
      {children}
    </select>
  );
}

export function AdminPageShell({ children }: { children: React.ReactNode }) {
  return <div className={styles.pageShell}>{children}</div>;
}

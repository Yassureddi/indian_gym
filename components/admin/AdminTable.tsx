import styles from "./admin-shared.module.css";

interface AdminTableProps {
  headers: string[];
  children: React.ReactNode;
}

export function AdminTable({ headers, children }: AdminTableProps) {
  return (
    <div className={styles.tableWrap}>
      <table className={styles.table}>
        <thead>
          <tr>
            {headers.map((h) => (
              <th key={h}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}

export function StatusBadge({
  status,
}: {
  status: string;
}) {
  return (
    <span className={`${styles.badge} ${styles[status] ?? ""}`}>
      {status}
    </span>
  );
}

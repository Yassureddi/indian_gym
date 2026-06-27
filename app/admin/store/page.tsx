import AdminPageHeader from "@/components/admin/AdminPageHeader";
import { AdminPageShell } from "@/components/admin/AdminFilterBar";
import StorePOS from "@/components/admin/pos/StorePOS";
import styles from "./page.module.css";

export default function AdminStorePage() {
  return (
    <AdminPageShell>
      <AdminPageHeader
        title="Store"
        description="In-store POS — sell supplements directly to gym members and walk-in customers."
      />
      <div className={styles.posWrap}>
        <StorePOS />
      </div>
    </AdminPageShell>
  );
}

"use client";

import { useEffect, useState } from "react";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import { AdminTable } from "@/components/admin/AdminTable";
import type { AttendanceRecord } from "@/lib/auth/types";

export default function AdminAttendancePage() {
  const [records, setRecords] = useState<AttendanceRecord[]>([]);

  useEffect(() => {
    fetch("/api/attendance")
      .then((r) => r.json())
      .then((d) => setRecords(d.records ?? []));
  }, []);

  return (
    <div>
      <AdminPageHeader
        title="Attendance"
        description="Track all member check-ins and gym visits across the facility."
      />
      <AdminTable headers={["Date", "Member ID", "Check In", "Check Out"]}>
        {records.length === 0 ? (
          <tr><td colSpan={4} style={{ textAlign: "center", color: "var(--color-text-muted)" }}>No records</td></tr>
        ) : (
          records.map((r) => (
            <tr key={r.id}>
              <td>{new Date(r.date).toLocaleDateString("en-IN", { dateStyle: "medium" })}</td>
              <td>{r.userId.replace("user_", "")}</td>
              <td>{r.checkIn}</td>
              <td>{r.checkOut ?? "—"}</td>
            </tr>
          ))
        )}
      </AdminTable>
    </div>
  );
}

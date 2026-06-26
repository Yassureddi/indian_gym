"use client";

import { useEffect, useState } from "react";
import GlassCard from "@/components/ui/GlassCard";
import type { AttendanceRecord } from "@/lib/auth/types";
import styles from "./page.module.css";

export default function AttendancePage() {
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [today, setToday] = useState<AttendanceRecord | null>(null);

  useEffect(() => {
    fetch("/api/attendance")
      .then((res) => res.json())
      .then((data) => {
        setRecords(data.records ?? []);
        setToday(data.today ?? null);
      });
  }, []);

  return (
    <div className={styles.page}>
      <h2 className="text-h3">Attendance</h2>
      <p className={styles.subtitle}>Your gym visit history and today&apos;s status.</p>

      {today && (
        <GlassCard hover={false} padding="md" className={styles.today}>
          <strong>Today:</strong> Checked in at {today.checkIn}
          {today.checkOut && ` · Checked out at ${today.checkOut}`}
        </GlassCard>
      )}

      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Date</th>
              <th>Check In</th>
              <th>Check Out</th>
            </tr>
          </thead>
          <tbody>
            {records.length === 0 ? (
              <tr>
                <td colSpan={3} className={styles.empty}>No attendance records yet.</td>
              </tr>
            ) : (
              records.map((record) => (
                <tr key={record.id}>
                  <td>{new Date(record.date).toLocaleDateString("en-IN", { dateStyle: "medium" })}</td>
                  <td>{record.checkIn}</td>
                  <td>{record.checkOut ?? "—"}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

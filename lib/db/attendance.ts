import { readJson, writeJson, createId } from "./store";
import type { AttendanceRecord } from "@/lib/auth/types";

const FILE = "attendance.json";

export async function getAttendance(): Promise<AttendanceRecord[]> {
  return readJson<AttendanceRecord[]>(FILE, []);
}

export async function getAttendanceByUserId(
  userId: string
): Promise<AttendanceRecord[]> {
  const records = await getAttendance();
  return records
    .filter((r) => r.userId === userId)
    .sort((a, b) => b.date.localeCompare(a.date));
}

export async function getTodayAttendance(
  userId: string
): Promise<AttendanceRecord | null> {
  const today = new Date().toISOString().split("T")[0];
  const records = await getAttendance();
  return records.find((r) => r.userId === userId && r.date === today) ?? null;
}

export async function checkIn(userId: string): Promise<AttendanceRecord> {
  const records = await getAttendance();
  const today = new Date().toISOString().split("T")[0];
  const existing = records.find((r) => r.userId === userId && r.date === today);

  if (existing) {
    return existing;
  }

  const record: AttendanceRecord = {
    id: createId("att"),
    userId,
    date: today,
    checkIn: new Date().toTimeString().slice(0, 5),
  };
  records.push(record);
  await writeJson(FILE, records);
  return record;
}

export async function checkOut(userId: string): Promise<AttendanceRecord | null> {
  const records = await getAttendance();
  const today = new Date().toISOString().split("T")[0];
  const index = records.findIndex((r) => r.userId === userId && r.date === today);

  if (index === -1) return null;

  records[index] = {
    ...records[index],
    checkOut: new Date().toTimeString().slice(0, 5),
  };
  await writeJson(FILE, records);
  return records[index];
}

export async function ensureSeedAttendance() {
  const records = await getAttendance();
  if (records.length > 0) return;

  const dates = Array.from({ length: 5 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (i + 1));
    return d.toISOString().split("T")[0];
  });

  const seed: AttendanceRecord[] = dates.map((date, i) => ({
    id: createId("att"),
    userId: "user_member_demo",
    date,
    checkIn: "06:30",
    checkOut: i % 2 === 0 ? "08:15" : undefined,
  }));

  await writeJson(FILE, seed);
}

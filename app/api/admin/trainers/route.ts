import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/session";
import { handleAuthError } from "@/lib/auth/api";
import { initializeDatabase } from "@/lib/db/init";
import { getTrainers } from "@/lib/db/trainers";
import { mapTrainer } from "@/lib/api/mappers";

export async function GET() {
  try {
    await requireAdmin();
    await initializeDatabase();
    const trainers = await getTrainers();
    return NextResponse.json({ trainers: trainers.map(mapTrainer) });
  } catch (error) {
    return handleAuthError(error);
  }
}

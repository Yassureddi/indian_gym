import { NextResponse } from "next/server";
import { fetchTrainers } from "@/lib/api/content";

export async function GET() {
  const trainers = await fetchTrainers();
  return NextResponse.json({ trainers });
}

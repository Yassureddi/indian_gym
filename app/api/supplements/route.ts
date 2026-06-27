import { NextRequest, NextResponse } from "next/server";
import { initializeDatabase } from "@/lib/db/init";
import { getPublishedSupplements } from "@/lib/db/supplements";

export async function GET(request: NextRequest) {
  await initializeDatabase();
  const { searchParams } = request.nextUrl;
  const category = searchParams.get("category");

  let supplements = await getPublishedSupplements();

  if (category && category !== "all") {
    supplements = supplements.filter((s) => s.category === category);
  }

  return NextResponse.json({ supplements });
}

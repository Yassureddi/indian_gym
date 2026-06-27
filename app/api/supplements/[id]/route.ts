import { NextResponse } from "next/server";
import { initializeDatabase } from "@/lib/db/init";
import { getSupplementById } from "@/lib/db/supplements";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: RouteContext) {
  await initializeDatabase();
  const { id } = await context.params;
  const supplement = await getSupplementById(id);

  if (!supplement || !supplement.isActive) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  return NextResponse.json({ supplement });
}

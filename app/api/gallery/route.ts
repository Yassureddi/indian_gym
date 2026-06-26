import { NextRequest, NextResponse } from "next/server";
import { fetchGalleryItems } from "@/lib/api/content";

export async function GET(request: NextRequest) {
  const category = request.nextUrl.searchParams.get("category") ?? undefined;
  const items = await fetchGalleryItems(category);
  return NextResponse.json({ items });
}

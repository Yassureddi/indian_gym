import { NextResponse } from "next/server";
import { getAboutPreviewImageUrl } from "@/lib/site-content";

export async function GET() {
  const url = await getAboutPreviewImageUrl();
  return NextResponse.json({ success: true, url });
}

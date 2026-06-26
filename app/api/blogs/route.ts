import { NextResponse } from "next/server";
import { fetchBlogs } from "@/lib/api/content";

export async function GET() {
  const blogs = await fetchBlogs();
  return NextResponse.json({ blogs });
}

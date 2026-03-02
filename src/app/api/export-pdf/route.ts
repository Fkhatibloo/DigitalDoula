import { NextRequest, NextResponse } from "next/server";
import { kv } from "@vercel/kv";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const storyId = searchParams.get("id");

  if (!storyId) {
    return NextResponse.json({ error: "Story ID required" }, { status: 400 });
  }

  const raw = await kv.get<string>(`story:${storyId}`);
  if (!raw) {
    return NextResponse.json({ error: "Story not found" }, { status: 404 });
  }

  const story = typeof raw === "string" ? JSON.parse(raw) : raw;
  
  // Return story data for client-side PDF generation
  return NextResponse.json(story);
}

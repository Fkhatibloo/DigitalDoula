import { kv } from "@vercel/kv";
import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: NextRequest) {
  try {
    const payload = await req.json();
    const storyId = uuidv4().slice(0, 8);
    await kv.set(`story:${storyId}`, { ...payload, createdAt: new Date().toISOString() }, { ex: 31536000 });
    const shareUrl = `${process.env.NEXT_PUBLIC_APP_URL}/story/${storyId}`;
    return NextResponse.json({ storyId, shareUrl });
  } catch (error) {
    return NextResponse.json({ error: "Share failed" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const id = new URL(req.url).searchParams.get("id");
  if (!id) return NextResponse.json({ error: "No ID" }, { status: 400 });
  const data = await kv.get(`story:${id}`);
  if (!data) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(data);
}

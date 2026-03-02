import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { storyId } = await req.json();
    const shareToken = Buffer.from(`${storyId}-${Date.now()}`).toString("base64url").slice(0, 12);
    const shareUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/shared/${shareToken}`;
    // In production: persist mapping in Vercel KV
    return NextResponse.json({ shareUrl, shareToken });
  } catch (err) {
    return NextResponse.json({ error: "Share failed" }, { status: 500 });
  }
}

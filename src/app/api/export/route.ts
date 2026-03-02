import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { type } = await req.json();
    if (type === "video") {
      return NextResponse.json({ jobId: `job_${Date.now()}`, status: "processing", estimatedSeconds: 30 });
    }
    return NextResponse.json({ message: "Use client-side PDF export" });
  } catch (error) {
    return NextResponse.json({ error: "Export failed" }, { status: 500 });
  }
}

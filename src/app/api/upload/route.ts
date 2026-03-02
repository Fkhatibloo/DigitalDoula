import { put } from "@vercel/blob";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();
    const files = form.getAll("files") as File[];
    const uploads = await Promise.all(
      files.map(async (file) => {
        const blob = await put(`stories/${Date.now()}-${file.name}`, file, { access: "public" });
        return { url: blob.url, type: file.type, name: file.name };
      })
    );
    return NextResponse.json({ uploads });
  } catch (error) {
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}

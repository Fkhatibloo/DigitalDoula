import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const configStr = formData.get("config") as string;
    const config = JSON.parse(configStr);

    const { recipientName, recipientRelationship, storyTone, authorName, personalNote } = config;

    const toneDescriptions: Record<string, string> = {
      warm: "warm, loving, and heartfelt",
      nostalgic: "nostalgic, tender, and gently reflective",
      celebratory: "joyful, celebratory, and uplifting",
      reflective: "quiet, contemplative, and deeply sincere",
    };

    const prompt = `You are writing a deeply personal multimedia story for ${recipientName} (${recipientRelationship || "a loved one"}) from ${authorName || "someone who loves them"}.

The tone should be ${toneDescriptions[storyTone] || "warm and loving"}.

${personalNote ? `The author wants them to know: "${personalNote}"` : ""}

Create a story with exactly 4 chapters. Each chapter should have:
- A poetic chapter title (short, evocative)
- A 3-4 sentence narration passage (first-person from the author's perspective, written directly to ${recipientName})

The chapters should flow as an emotional arc:
1. The beginning / early memories
2. Formative moments / growth  
3. Who they've become
4. What the author wants them to carry forward

Respond ONLY as valid JSON, no markdown, in this exact format:
{
  "title": "overall story title",
  "chapters": [
    { "title": "chapter title", "narration": "narration text" },
    { "title": "chapter title", "narration": "narration text" },
    { "title": "chapter title", "narration": "narration text" },
    { "title": "chapter title", "narration": "narration text" }
  ]
}`;

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY || "",
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1500,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    const data = await response.json();
    const text = data.content?.[0]?.text || "{}";
    const storyContent = JSON.parse(text.replace(/```json|```/g, "").trim());

    // In production: save to Vercel KV with a UUID
    const storyId = `story_${Date.now()}`;

    return NextResponse.json({
      storyId,
      ...storyContent,
    });
  } catch (err) {
    console.error("Story generation error:", err);
    return NextResponse.json({ storyId: "demo", error: "Generation failed" }, { status: 200 });
  }
}

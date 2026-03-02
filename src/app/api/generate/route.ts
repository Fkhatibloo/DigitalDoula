import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

const client = new Anthropic();

export async function POST(req: NextRequest) {
  try {
    const { theme, recipientName, authorName, photoCount, photoDescriptions } = await req.json();

    const message = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1024,
      messages: [{
        role: "user",
        content: `You are helping create a deeply personal "${theme?.label}" story for ${recipientName || "someone special"} from ${authorName || "someone who loves them"}.

Theme: ${theme?.description}
Collection: ${photoCount} photos and videos
${photoDescriptions ? `\nPhoto context:\n${photoDescriptions}` : ""}

Create a 6-slide rich multimedia story. Return ONLY valid JSON:
{
  "storyTitle": "...",
  "openingLine": "...",
  "slides": [
    { "title": "...(5 words max)", "prose": "...(2-4 heartfelt sentences)", "caption": "...(10 words max)", "emotion": "joy|love|gratitude|wonder|peace|tenderness" }
  ],
  "closingMessage": "...(2-3 sentences)"
}`,
      }],
    });

    const text = message.content.map(c => c.type === "text" ? c.text : "").join("");
    const story = JSON.parse(text.replace(/```json|```/g, "").trim());
    return NextResponse.json({ story });
  } catch (error) {
    return NextResponse.json({ error: "Generation failed" }, { status: 500 });
  }
}
